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

// Mock image captioning service
async function generateImageCaptions(imageBuffer: Buffer): Promise<{ english: string; telugu: string; hindi: string }> {
  // In a real implementation, this would call an AI service like OpenAI GPT-4 Vision or Hugging Face BLIP
  // For now, we'll return mock captions
  const mockCaptions = [
    {
      english: "A beautiful landscape with mountains, trees, and clear blue skies creating a serene natural scene.",
      telugu: "పర్వతాలు, చెట్లు మరియు స్పష్టమైన నీలిరంగు ఆకాశంతో ఒక అందమైన ప్రకృతి దృశ్యం.",
      hindi: "पहाड़ों, पेड़ों और स्पष्ट नीले आसमान के साथ एक सुंदर प्राकृतिक दृश्य।"
    },
    {
      english: "An urban cityscape featuring modern buildings, busy streets, and architectural elements in daylight.",
      telugu: "ఆధునిక భవనాలు, రద్దీగా ఉన్న వీధులు మరియు పగటి వేళల్లో వాస్తుశిల్ప అంశాలతో కూడిన పట్టణ దృశ్యం.",
      hindi: "आधुनिक इमारतों, व्यस्त सड़कों और दिन के उजाले में स्थापत्य तत्वों वाला एक शहरी दृश्य।"
    },
    {
      english: "A natural outdoor scene with vegetation, open spaces, and elements of the natural environment.",
      telugu: "వృక్షసంపద, బహిరంగ ప్రదేశాలు మరియు సహజ పర్యావరణ అంశాలతో కూడిన సహజ బహిరంగ దృశ్యం.",
      hindi: "वनस्पति, खुली जगहों और प्राकृतिक पर्यावरण के तत्वों के साथ एक प्राकृतिक बाहरी दृश्य।"
    }
  ];
  
  // Return a random caption set
  const randomCaption = mockCaptions[Math.floor(Math.random() * mockCaptions.length)];
  
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return randomCaption;
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
      const captions = await generateImageCaptions(imageBuffer);

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
