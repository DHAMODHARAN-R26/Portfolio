import express from 'express';
import multer from 'multer';
import { db } from '../config/db.js';
import { generateChatbotResponse, enhanceText, analyzeResume, extractTextFromPdf } from '../services/ai.js';
import { aiLimiter, verifyAdminToken } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

/**
 * Public route: AI Chatbot widget
 */
router.post('/chat', aiLimiter, async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message content is required.' });
    }

    const portfolioData = {
      profile: await db.profile.get(),
      skills: await db.skills.getAll(),
      projects: await db.projects.getAll(),
      achievements: await db.achievements.getAll()
    };

    const reply = await generateChatbotResponse(history || [], message, portfolioData);
    res.json({ reply });
  } catch (err) {
    console.error('AI Chatbot endpoint error:', err);
    res.status(500).json({ message: 'Failed to generate AI response.' });
  }
});

/**
 * Public route: Analyze candidate resume
 */
router.post('/analyze-resume', aiLimiter, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required.' });
    }

    let resumeText = '';
    
    // Parse depending on file type
    if (req.file.mimetype === 'application/pdf') {
      resumeText = await extractTextFromPdf(req.file.buffer);
    } else if (req.file.mimetype === 'text/plain') {
      resumeText = req.file.buffer.toString('utf8');
    } else {
      return res.status(400).json({ message: 'Unsupported file type. Please upload a PDF or TXT file.' });
    }

    if (!resumeText.trim()) {
      return res.status(400).json({ message: 'Uploaded resume appears to be empty.' });
    }

    const portfolioData = {
      profile: await db.profile.get(),
      skills: await db.skills.getAll()
    };

    const analysis = await analyzeResume(resumeText, portfolioData);
    res.json({ analysis });
  } catch (err) {
    console.error('AI Resume analysis endpoint error:', err);
    res.status(500).json({ message: 'Failed to analyze resume. Make sure it is a readable text-based PDF.' });
  }
});

/**
 * Admin protected route: Enhance bio / project descriptions
 */
router.post('/enhance', verifyAdminToken, async (req, res) => {
  try {
    const { text, field } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Text is required for enhancement.' });
    }

    const enhanced = await enhanceText(text, field || 'description');
    res.json({ enhanced });
  } catch (err) {
    console.error('AI Enhancer endpoint error:', err);
    res.status(500).json({ message: 'Failed to enhance text.' });
  }
});

export default router;
