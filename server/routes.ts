import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertImageSchema } from "@shared/schema";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

import { GoogleGenAI } from "@google/genai";

// Gemini image captioning service
async function generateImageCaptions(imageBuffer: Buffer, mimeType: string = 'image/jpeg'): Promise<{ english: string; telugu: string; hindi: string }> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  try {
    // Convert buffer to base64
    const imageBase64 = imageBuffer.toString('base64');

    // First, get English caption
    const englishResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType,
          },
        },
        "Analyze this image in detail and provide a rich, descriptive caption in English. Include specific visual details like colors, objects, people, emotions, setting, lighting, and any interesting elements you observe. Make it detailed and engaging, around 2-3 sentences."
      ],
    });

    const englishCaption = englishResponse.text || "A beautiful image with various visual elements.";

    // Generate Telugu caption
    const teluguResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType,
          },
        },
        "ఈ చిత్రాన్ని వివరంగా విశ్లేషించి, తెలుగులో గొప్ప, వర్ణనాత్మక శీర్షిక అందించండి. రంగులు, వస్తువులు, వ్యక్తులు, భావోద్వేగాలు, వాతావరణం, వెలుతురు మరియు మీరు గమనించే ఆసక్తికరమైన అంశాలు వంటి నిర్దిష్ట దృశ్య వివరాలను చేర్చండి. దీన్ని వివరంగా మరియు ఆకర్షణీయంగా చేయండి, దాదాపు 2-3 వాక్యాలు."
      ],
    });

    const teluguCaption = teluguResponse.text || "వివిధ దృశ్య అంశాలతో అందమైన చిత్రం.";

    // Generate Hindi caption
    const hindiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType,
          },
        },
        "इस छवि का विस्तार से विश्लेषण करें और हिंदी में एक समृद्ध, वर्णनात्मक कैप्शन प्रदान करें। रंग, वस्तुओं, लोगों, भावनाओं, सेटिंग, प्रकाश व्यवस्था और आपके द्वारा देखे गए किसी भी दिलचस्प तत्वों जैसे विशिष्ट दृश्य विवरण शामिल करें। इसे विस्तृत और आकर्षक बनाएं, लगभग 2-3 वाक्य।"
      ],
    });

    const hindiCaption = hindiResponse.text || "विभिन्न दृश्य तत्वों के साथ एक सुंदर छवि।";

    return {
      english: englishCaption,
      telugu: teluguCaption,
      hindi: hindiCaption
    };

  } catch (error) {
    console.error("Error generating captions with Gemini:", error);
    // Fallback to a generic caption if Gemini fails
    return {
      english: "An image with various visual elements that couldn't be analyzed automatically.",
      telugu: "స్వయంచాలకంగా విశ్లేషించలేని వివిధ దృశ్య అంశాలతో కూడిన చిత్రం.",
      hindi: "विभिन्न दृश्य तत्वों के साथ एक छवि जिसका स्वचालित रूप से विश्लेषण नहीं किया जा सका।"
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Serve uploaded images
  app.use('/uploads', express.static(uploadDir));

  // Image upload endpoint
  app.post('/api/upload-image', isAuthenticated, upload.single('image'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      // Create image record
      const imageData = {
        userId,
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size.toString(),
        imageUrl: `/uploads/${file.filename}`,
      };

      const validatedData = insertImageSchema.parse(imageData);
      const image = await storage.createImage(validatedData);

      // Generate captions asynchronously
      const imageBuffer = fs.readFileSync(file.path);
      const captions = await generateImageCaptions(imageBuffer, file.mimetype);

      // Update image with captions
      const updatedImage = await storage.updateImageCaptions(image.id, captions);

      res.json(updatedImage);
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  // Get user's image history
  app.get('/api/images', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const images = await storage.getImagesByUserId(userId);
      res.json(images);
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({ message: "Failed to fetch images" });
    }
  });

  // Get specific image
  app.get('/api/images/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const imageId = req.params.id;
      
      const image = await storage.getImageById(imageId);
      
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }

      // Ensure user can only access their own images
      if (image.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(image);
    } catch (error) {
      console.error("Error fetching image:", error);
      res.status(500).json({ message: "Failed to fetch image" });
    }
  });

  // Delete specific image
  app.delete('/api/images/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const imageId = req.params.id;
      
      const image = await storage.getImageById(imageId);
      
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }

      // Ensure user can only delete their own images
      if (image.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Delete the file from filesystem
      const filePath = path.join(uploadDir, image.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Delete from database
      const deleted = await storage.deleteImage(imageId);
      
      if (deleted) {
        res.json({ message: "Image deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete image" });
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ message: "Failed to delete image" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
