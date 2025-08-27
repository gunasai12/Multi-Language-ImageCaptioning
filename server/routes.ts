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
      english: "A stunning landscape photograph showcasing majestic snow-capped mountains rising against a brilliant azure sky, with lush green forests covering the lower slopes and a crystal-clear river winding through the valley below. The golden sunlight creates beautiful shadows and highlights, giving the scene a peaceful and breathtaking quality that captures the untouched beauty of nature.",
      telugu: "మనోహరమైన మంచుతో కప్పబడిన పర్వతాలు, ప్రకాశవంతమైన నీలిరంగు ఆకాశానికి వ్యతిరేకంగా ఎత్తుగా నిలిచి, కింది వాలులను కప్పివేసిన పచ్చని అడవులు మరియు లోయలో వంకరగా ప్రవహించే స్పటికంలా స్పష్టమైన నది కనిపించే అద్భుతమైన ప్రకృతి దృశ్యం. బంగారు సూర్యకాంతి అందమైన నీడలు మరియు వెలుగులను సృష్టిస్తుంది, ఈ దృశ్యానికి ప్రశాంతమైన మరియు ఉత్కంఠభరితమైన గుణాన్ని అందిస్తుంది.",
      hindi: "बर्फ से ढके राजसी पहाड़ों का एक आश्चर्यजनक परिदृश्य फोटोग्राफ, जो चमकीले नीले आसमान के सामने ऊंचे खड़े हैं, निचली ढलानों को कवर करने वाले हरे-भरे जंगल और नीचे घाटी से होकर बहने वाली क्रिस्टल-साफ नदी दिखाई दे रही है। सुनहरी धूप सुंदर छाया और हाइलाइट्स बनाती है, जो इस दृश्य को एक शांतिपूर्ण और मंत्रमुग्ध करने वाली गुणवत्ता देती है।"
    },
    {
      english: "A vibrant urban cityscape captured during the bustling evening hours, featuring gleaming glass skyscrapers reflecting the warm glow of street lights, busy pedestrians walking along wide sidewalks lined with modern shops and cafes, and streams of vehicle headlights creating beautiful light trails through the metropolitan streets. The scene perfectly captures the energy and dynamism of modern city life.",
      telugu: "రద్దీగా ఉండే సాయంత్రం సమయంలో తీసిన ఒక చురుకైన పట్టణ దృశ్యం, వీధి దీపాల వెచ్చని కాంతిని ప్రతిబింబించే మెరుస్తున్న గాజు ఆకాశహర్మ్యాలు, ఆధునిక దుకాణాలు మరియు కేఫ్‌లతో కూడిన విశాలమైన పాదచారుల మార్గాల వెంట నడుస్తున్న బిజీ పాదచారులు, మరియు మెట్రోపాలిటన్ వీధుల గుండా అందమైన కాంతి ట్రయిల్స్ సృష్టిస్తున్న వాహనాల హెడ్‌లైట్ల ప్రవాహాలు ఉన్నాయి. ఈ దృశ్యం ఆధునిక నగర జీవితంలోని శక్తి మరియు చైతన్యాన్ని అద్భుతంగా చిత్రీకరిస్తుంది.",
      hindi: "शाम के व्यस्त घंटों के दौरान कैप्चर किया गया एक जीवंत शहरी दृश्य, जिसमें सड़क की रोशनी की गर्म चमक को प्रतिबिंबित करती चमकदार कांच की गगनचुंबी इमारतें, आधुनिक दुकानों और कैफे से भरी चौड़ी फुटपाथों के साथ चलते व्यस्त पैदल यात्री, और वाहनों की हेडलाइटों की धाराएं जो महानगरीय सड़कों से होकर सुंदर प्रकाश पथ बनाती हैं। यह दृश्य आधुनिक शहरी जीवन की ऊर्जा और गतिशीलता को पूर्ण रूप से दर्शाता है।"
    },
    {
      english: "A serene and picturesque garden scene featuring colorful blooming flowers in full spring glory, including vibrant roses, delicate cherry blossoms, and cheerful tulips arranged in well-maintained flower beds. Ancient oak trees provide natural shade over winding cobblestone pathways, while a charming wooden bench sits beside a gentle fountain, creating the perfect spot for peaceful contemplation and relaxation.",
      telugu: "పూర్ణ వసంత వైభవంలో వర్ణవిభాంగ వికసించిన పువ్వులతో కూడిన ప్రశాంతమైన మరియు మనోహరమైన తోట దృశ్యం, ఇందులో చురుకైన గులాబీలు, సున్నితమైన చెర్రీ బ్లాసమ్స్, మరియు బాగా నిర్వహించబడిన పుష్ప గడ్డలలో అమర్చబడిన ఉల్లాసమైన ట్యూలిప్స్ ఉన్నాయి. పురాతన ఓక్ చెట్లు వంకరగా ఉన్న రాతి మార్గాలపై సహజ నీడను అందిస్తాయి, అలాగే ఒక మనోహరమైన చెక్క బెంచ్ సున్నితమైన ఫౌంటైన్ పక్కన కూర్చుని, ప్రశాంతమైన ఆలోచన మరియు విశ్రాంతి కోసం అద్భుతమైన ప్రదేశాన్ని సృష్టిస్తుంది.",
      hindi: "पूर्ण वसंत की महिमा में रंगबिरंगे खिले हुए फूलों के साथ एक शांत और सुरम्य बगीचे का दृश्य, जिसमें जीवंत गुलाब, नाजुक चेरी ब्लॉसम, और अच्छी तरह से बनाए गए फूलों की क्यारियों में व्यवस्थित प्रसन्न ट्यूलिप शामिल हैं। प्राचीन ओक के पेड़ घुमावदार पत्थर के रास्तों पर प्राकृतिक छाया प्रदान करते हैं, जबकि एक आकर्षक लकड़ी की बेंच एक कोमल फव्वारे के पास बैठी है, जो शांतिपूर्ण चिंतन और विश्राम के लिए एक आदर्श स्थान बनाती है।"
    },
    {
      english: "An intimate family gathering captured in a warm and inviting living room, where multiple generations are sharing joyful moments together. The elderly grandparents sit comfortably on a plush sofa while energetic children play on a soft carpet, and parents engage in animated conversation. Soft natural light filters through large windows, highlighting the genuine smiles and laughter that fill this heartwarming scene of family bonding and love.",
      telugu: "వెచ్చని మరియు ఆకర్షణీయమైన గదిలో బంధుత్వం మరియు ప్రేమతో నిండిన హృదయస్పర్శీ దృశ్యంలో బహుళ తరాలు కలిసి ఆనందకరమైన క్షణాలను పంచుకుంటున్న అంతరంగిక కుటుంబ సమావేశం. వృద్ధ తాతముత్తాతలు మృదువైన సోఫాలో హాయిగా కూర్చుని ఉండగా, చురుకైన పిల్లలు మృదువైన కార్పెట్‌పై ఆడుకుంటున్నారు, మరియు తల్లిదండ్రులు ఉత్సాహభరితమైన సంభాషణలో నిమగ్నమై ఉన్నారు. పెద్ద కిటికీల గుండా మృదువైన సహజ కాంతి వడపోతుంది, ఈ హృదయాన్ని హత్తుకునే కుటుంబ బంధం మరియు ప్రేమ దృశ్యాన్ని నింపే నిజమైన చిరునవ్వులు మరియు నవ్వులను హైలైట్ చేస్తుంది.",
      hindi: "एक गर्म और आमंत्रित लिविंग रूम में कैप्चर किया गया एक अंतरंग पारिवारिक मिलन, जहां कई पीढ़ियां एक साथ खुशी के पल साझा कर रही हैं। बुजुर्ग दादा-दादी आरामदायक सोफे पर आराम से बैठे हैं जबकि ऊर्जावान बच्चे नरम कालीन पर खेल रहे हैं, और माता-पिता जीवंत बातचीत में व्यस्त हैं। बड़ी खिड़कियों से कोमल प्राकृतिक प्रकाश फिल्टर होता है, वास्तविक मुस्कान और हंसी को उजागर करता है जो पारिवारिक बंधन और प्रेम के इस दिल को छू लेने वाले दृश्य को भरता है।"
    },
    {
      english: "A delicious and artfully plated gourmet meal presented on elegant white porcelain, featuring perfectly grilled salmon with a golden crispy skin, accompanied by colorful roasted vegetables including vibrant purple eggplant, bright orange carrots, and fresh green asparagus. A delicate herb garnish and drizzle of premium olive oil complete this restaurant-quality presentation that showcases culinary excellence and attention to detail.",
      telugu: "సొగసైన తెల్లని పింగాణీలో కళాత్మకంగా అందజేయబడిన రుచికరమైన గౌర్మెట్ భోజనం, బంగారు రంగు కరకరలాడే చర్మంతో పరిపూర్ణంగా గ్రిల్ చేయబడిన సాల్మన్ చేపతో కూడి, రంగురంగుల కాల్చిన కూరగాయలతో పాటుగా ప్రకాశవంతమైన ఊదా రంగు వంకాయ, ప్రకాశవంతమైన నారింజ రంగు క్యారెట్లు, మరియు తాజా ఆకుపచ్చ ఆస్పరాగస్ ఉన్నాయి. సున్నితమైన మూలిక అలంకరణ మరియు ప్రీమియం ఆలివ్ ఆయిల్ చుక్కలు ఈ రెస్టారెంట్-నాణ్యత ప్రదర్శనను పూర్తిచేస్తాయి, ఇది పాక నైపుణ్యం మరియు వివరాలపై దృష్టిని ప్రదర్శిస్తుంది.",
      hindi: "सुरुचिपूर्ण सफेद चीनी मिट्टी के बर्तनों पर कलात्मक रूप से प्रस्तुत एक स्वादिष्ट और उत्कृष्ट भोजन, जिसमें सुनहरी कुरकुरी त्वचा के साथ पूर्ण रूप से ग्रिल्ड सैल्मन है, जो रंगबिरंगी भुनी हुई सब्जियों के साथ है जिसमें चमकदार बैंगनी बैंगन, चमकीले नारंगी गाजर, और ताजा हरी शतावरी शामिल है। नाजुक जड़ी-बूटी की सजावट और प्रीमियम जैतून तेल की बूंदें इस रेस्तरां-गुणवत्ता प्रस्तुति को पूरा करती हैं जो पाक उत्कृष्टता और विस्तार पर ध्यान दर्शाती है।"
    },
    {
      english: "A heartwarming scene of a loyal golden retriever playing joyfully in a sun-dappled meadow filled with wildflowers, its glossy coat shining in the warm afternoon sunlight as it bounds energetically through tall grass with its tongue hanging out in pure happiness. Colorful butterflies dance around the playful dog while birds chirp melodiously in nearby trees, creating a perfect moment of carefree joy and natural beauty.",
      telugu: "సూర్యకాంతితో చెల్లాచెదురుగా ఉన్న అడవి పువ్వులతో నిండిన పచ్చిక బయలులో ఆనందంగా ఆడుకుంటున్న నమ్మకమైన గోల్డెన్ రిట్రీవర్ యొక్క హృదయాన్ని హత్తుకునే దృశ్యం, వేడుకగా మధ్యాహ్న సూర్యకాంతిలో మెరుస్తున్న దాని నిగనిగలాడే బొచ్చు మరియు పూర్తి ఆనందంలో నాలుక వేలాడదీసి ఎత్తైన గడ్డిలో శక్తివంతంగా దూకుతున్న దృశ్యం. రంగురంగుల సీతాకోకచిలుకలు ఆట ప్రియుడైన కుక్క చుట్టూ నృత్యం చేస్తున్నాయి, అలాగే పక్కనే ఉన్న చెట్లలోని పక్షులు మధుర గానం చేస్తున్నాయి, ఇది నిర్లక్ష్య ఆనందం మరియు సహజ అందం యొక్క పరిపూర్ణ క్షణాన్ని సృష్టిస్తుంది.",
      hindi: "जंगली फूलों से भरे धूप-धब्बेदार घास के मैदान में खुशी से खेलते एक वफादार गोल्डन रिट्रीवर का दिल छू लेने वाला दृश्य, गर्म दोपहर की धूप में इसका चमकदार कोट चमक रहा है क्योंकि यह शुद्ध खुशी में अपनी जीभ लटकाए हुए लंबी घास में उत्साह से उछल रहा है। रंगबिरंगी तितलियां खेलते कुत्ते के चारों ओर नृत्य करती हैं जबकि पास के पेड़ों में पक्षी मधुर गान करते हैं, जो निश्चिंत आनंद और प्राकृतिक सुंदरता का एक आदर्श क्षण बनाता है।"
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
