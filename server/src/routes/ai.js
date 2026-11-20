import express from 'express';
import multer from 'multer';
import { db } from '../config/db.js';
import { 
  generateChatbotResponse, 
  enhanceText, 
  analyzeResume, 
  extractTextFromPdf,
  matchJobDescription,
  compareResumes,
  getDhamoResumeText
} from '../services/ai.js';
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
      achievements: await db.achievements.getAll(),
      experience: await db.experience.getAll(),
      education: await db.education.getAll(),
      certifications: await db.certifications.getAll()
    };

    const reply = await generateChatbotResponse(history || [], message, portfolioData);
    res.json({ reply });
  } catch (err) {
    console.error('AI Chatbot endpoint error:', err);
    res.status(500).json({ message: 'Failed to generate AI response.' });
  }
});

/**
 * Public route: Analyze candidate resume (General Review)
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
      skills: await db.skills.getAll(),
      projects: await db.projects.getAll(),
      achievements: await db.achievements.getAll(),
      experience: await db.experience.getAll(),
      education: await db.education.getAll(),
      certifications: await db.certifications.getAll()
    };

    const analysis = await analyzeResume(resumeText, portfolioData);
    res.json({ analysis });
  } catch (err) {
    console.error('AI Resume analysis endpoint error:', err);
    res.status(500).json({ message: 'Failed to analyze resume. Make sure it is a readable text-based PDF.' });
  }
});

/**
 * Feature 1: Evaluate candidate resume against Job Description & Qualifications
 */
router.post('/match-job', aiLimiter, upload.single('resume'), async (req, res) => {
  try {
    const { jobTitle, jobDescription, qualifications, useMyResume } = req.body;

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ message: 'Job Description is required.' });
    }

    const portfolioData = {
      profile: await db.profile.get(),
      skills: await db.skills.getAll(),
      projects: await db.projects.getAll(),
      achievements: await db.achievements.getAll(),
      experience: await db.experience.getAll(),
      education: await db.education.getAll(),
      certifications: await db.certifications.getAll()
    };

    let resumeText = '';

    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        resumeText = await extractTextFromPdf(req.file.buffer);
      } else if (req.file.mimetype === 'text/plain') {
        resumeText = req.file.buffer.toString('utf8');
      } else {
        return res.status(400).json({ message: 'Please upload a PDF or TXT file.' });
      }
    } else {
      // By default or when useMyResume is set, evaluate Dhamodharan's verified resume
      resumeText = await getDhamoResumeText(portfolioData);
    }

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({ message: 'Unable to retrieve resume text for job matching.' });
    }

    const analysis = await matchJobDescription({
      jobTitle: jobTitle || 'Software Engineer',
      jobDescription,
      qualifications: qualifications || '',
      resumeText,
      portfolioData
    });

    res.json({ analysis });
  } catch (err) {
    console.error('AI Job match endpoint error:', err);
    res.status(500).json({ message: 'Failed to evaluate job match. ' + (err.message || '') });
  }
});

/**
 * Feature 2: Compare candidate resume against Dhamodharan's verified portfolio resume
 */
router.post('/compare-resumes', aiLimiter, upload.single('candidateResume'), async (req, res) => {
  try {
    const { candidateText } = req.body;
    let candidateResumeText = candidateText || '';

    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        candidateResumeText = await extractTextFromPdf(req.file.buffer);
      } else if (req.file.mimetype === 'text/plain') {
        candidateResumeText = req.file.buffer.toString('utf8');
      } else {
        return res.status(400).json({ message: 'Please upload a PDF or TXT file for comparison.' });
      }
    }

    if (!candidateResumeText || !candidateResumeText.trim()) {
      return res.status(400).json({ message: 'Please upload or paste Candidate B resume for comparison.' });
    }

    const portfolioData = {
      profile: await db.profile.get(),
      skills: await db.skills.getAll(),
      projects: await db.projects.getAll(),
      achievements: await db.achievements.getAll(),
      experience: await db.experience.getAll(),
      education: await db.education.getAll(),
      certifications: await db.certifications.getAll()
    };

    const myResumeText = await getDhamoResumeText(portfolioData);

    const analysis = await compareResumes({
      candidateResumeText,
      myResumeText,
      portfolioData
    });

    res.json({ analysis });
  } catch (err) {
    console.error('AI Compare resumes endpoint error:', err);
    res.status(500).json({ message: 'Failed to compare resumes. ' + (err.message || '') });
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
