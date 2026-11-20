import express from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loginLimiter, verifyAdminToken } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-default-jwt-key';

// Keep track of the password dynamically
const getAdminPassword = () => process.env.ADMIN_PASSWORD || 'admin';

/**
 * Admin login endpoint
 */
router.post('/login', loginLimiter, (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ message: 'Password is required.' });
  }

  if (password !== getAdminPassword()) {
    return res.status(401).json({ message: 'Invalid admin credentials.' });
  }

  // Sign JWT token valid for 2 hours
  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '2h' });
  
  res.json({
    token,
    expiresIn: 7200,
    message: 'Authentication successful.'
  });
});

/**
 * Check token validity
 */
router.get('/verify', verifyAdminToken, (req, res) => {
  res.json({ valid: true, role: 'admin' });
});

/**
 * Change admin password endpoint
 */
router.post('/change-password', verifyAdminToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (currentPassword !== getAdminPassword()) {
    return res.status(401).json({ message: 'Incorrect current password.' });
  }

  if (!newPassword || newPassword.length < 4) {
    return res.status(400).json({ message: 'New password must be at least 4 characters long.' });
  }

  try {
    // 1. Update in-memory for immediate effect
    process.env.ADMIN_PASSWORD = newPassword;
    
    // 2. Update .env file for persistence
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const envPath = path.join(__dirname, '..', '..', '..', '.env'); 
    
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      if (envContent.includes('ADMIN_PASSWORD=')) {
        envContent = envContent.replace(/ADMIN_PASSWORD=.*/g, `ADMIN_PASSWORD=${newPassword}`);
      } else {
        envContent += `\nADMIN_PASSWORD=${newPassword}`;
      }
      
      fs.writeFileSync(envPath, envContent, 'utf8');
    }
    
    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Failed to update password:', err);
    res.status(500).json({ message: 'Failed to save new password.' });
  }
});

/**
 * Update API Keys endpoint
 */
router.post('/api-keys', verifyAdminToken, (req, res) => {
  const { geminiKey, openaiKey } = req.body;
  
  try {
    // 1. Update in-memory for immediate effect
    if (geminiKey !== undefined) process.env.GEMINI_API_KEY = geminiKey;
    if (openaiKey !== undefined) process.env.OPENAI_API_KEY = openaiKey;
    
    // 2. Update .env file for persistence
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const envPath = path.join(__dirname, '..', '..', '..', '.env'); 
    
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      if (geminiKey !== undefined) {
        if (envContent.includes('GEMINI_API_KEY=')) {
          envContent = envContent.replace(/GEMINI_API_KEY=.*/g, `GEMINI_API_KEY=${geminiKey}`);
        } else {
          envContent += `\nGEMINI_API_KEY=${geminiKey}`;
        }
      }
      
      if (openaiKey !== undefined) {
        if (envContent.includes('OPENAI_API_KEY=')) {
          envContent = envContent.replace(/OPENAI_API_KEY=.*/g, `OPENAI_API_KEY=${openaiKey}`);
        } else {
          envContent += `\nOPENAI_API_KEY=${openaiKey}`;
        }
      }
      
      fs.writeFileSync(envPath, envContent, 'utf8');
    }
    
    res.json({ message: 'API Keys updated successfully.' });
  } catch (err) {
    console.error('Failed to update API keys:', err);
    res.status(500).json({ message: 'Failed to save API keys.' });
  }
});

export default router;
