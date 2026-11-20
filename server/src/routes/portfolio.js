import express from 'express';
import { db } from '../config/db.js';
import { verifyAdminToken } from '../middleware/auth.js';
import { sendContactNotification } from '../services/mail.js';

const router = express.Router();

/**
 * Public route to fetch all portfolio data at once (highly optimized)
 */
router.get('/data', async (req, res) => {
  try {
    const profile = await db.profile.get();
    const skills = await db.skills.getAll();
    const projects = await db.projects.getAll();
    const achievements = await db.achievements.getAll();
    const education = await db.education.getAll();
    const experience = await db.experience.getAll();
    const certifications = await db.certifications.getAll();
    
    res.json({ profile, skills, projects, achievements, education, experience, certifications });
  } catch (err) {
    console.error('Error fetching portfolio data:', err);
    res.status(500).json({ message: 'Internal server error fetching portfolio data.' });
  }
});

// ==========================================
// Profile Endpoints
// ==========================================

router.post('/profile', verifyAdminToken, async (req, res) => {
  try {
    const updated = await db.profile.update(req.body);
    if (req.io) req.io.emit('portfolio_updated', { type: 'profile', data: updated });
    res.json({ message: 'Profile updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// ==========================================
// Skills Endpoints
// ==========================================

router.post('/skills', verifyAdminToken, async (req, res) => {
  try {
    const skill = await db.skills.create(req.body);
    if (req.io) req.io.emit('portfolio_updated', { type: 'skills' });
    res.status(201).json({ message: 'Skill created successfully', data: skill });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create skill' });
  }
});

router.put('/skills/:id', verifyAdminToken, async (req, res) => {
  try {
    const updated = await db.skills.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Skill not found' });
    if (req.io) req.io.emit('portfolio_updated', { type: 'skills' });
    res.json({ message: 'Skill updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update skill' });
  }
});

router.delete('/skills/:id', verifyAdminToken, async (req, res) => {
  try {
    const success = await db.skills.delete(req.params.id);
    if (!success) return res.status(404).json({ message: 'Skill not found' });
    if (req.io) req.io.emit('portfolio_updated', { type: 'skills' });
    res.json({ message: 'Skill deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete skill' });
  }
});

// ==========================================
// Projects Endpoints
// ==========================================

router.post('/projects', verifyAdminToken, async (req, res) => {
  try {
    const project = await db.projects.create(req.body);
    if (req.io) req.io.emit('portfolio_updated', { type: 'projects' });
    res.status(201).json({ message: 'Project created successfully', data: project });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create project' });
  }
});

router.put('/projects/:id', verifyAdminToken, async (req, res) => {
  try {
    const updated = await db.projects.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Project not found' });
    if (req.io) req.io.emit('portfolio_updated', { type: 'projects' });
    res.json({ message: 'Project updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update project' });
  }
});

router.delete('/projects/:id', verifyAdminToken, async (req, res) => {
  try {
    const success = await db.projects.delete(req.params.id);
    if (!success) return res.status(404).json({ message: 'Project not found' });
    if (req.io) req.io.emit('portfolio_updated', { type: 'projects' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

// ==========================================
// Achievements Endpoints
// ==========================================

router.post('/achievements', verifyAdminToken, async (req, res) => {
  try {
    const achievement = await db.achievements.create(req.body);
    if (req.io) req.io.emit('portfolio_updated', { type: 'achievements' });
    res.status(201).json({ message: 'Achievement created successfully', data: achievement });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create achievement' });
  }
});

router.put('/achievements/:id', verifyAdminToken, async (req, res) => {
  try {
    const updated = await db.achievements.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Achievement not found' });
    if (req.io) req.io.emit('portfolio_updated', { type: 'achievements' });
    res.json({ message: 'Achievement updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update achievement' });
  }
});

router.delete('/achievements/:id', verifyAdminToken, async (req, res) => {
  try {
    const success = await db.achievements.delete(req.params.id);
    if (!success) return res.status(404).json({ message: 'Achievement not found' });
    if (req.io) req.io.emit('portfolio_updated', { type: 'achievements' });
    res.json({ message: 'Achievement deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete achievement' });
  }
});

// ==========================================
// Experience Endpoints
// ==========================================

router.post('/experience', verifyAdminToken, async (req, res) => {
  try {
    const item = await db.experience.create(req.body);
    if (req.io) req.io.emit('portfolio_updated', { type: 'experience' });
    res.status(201).json({ message: 'Experience created successfully', data: item });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create experience' });
  }
});

router.put('/experience/:id', verifyAdminToken, async (req, res) => {
  try {
    const updated = await db.experience.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Experience not found' });
    if (req.io) req.io.emit('portfolio_updated', { type: 'experience' });
    res.json({ message: 'Experience updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update experience' });
  }
});

router.delete('/experience/:id', verifyAdminToken, async (req, res) => {
  try {
    const success = await db.experience.delete(req.params.id);
    if (!success) return res.status(404).json({ message: 'Experience not found' });
    if (req.io) req.io.emit('portfolio_updated', { type: 'experience' });
    res.json({ message: 'Experience deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete experience' });
  }
});

// ==========================================
// Education Endpoints
// ==========================================

router.post('/education', verifyAdminToken, async (req, res) => {
  try {
    const item = await db.education.create(req.body);
    if (req.io) req.io.emit('portfolio_updated', { type: 'education' });
    res.status(201).json({ message: 'Education created successfully', data: item });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create education' });
  }
});

router.put('/education/:id', verifyAdminToken, async (req, res) => {
  try {
    const updated = await db.education.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Education not found' });
    if (req.io) req.io.emit('portfolio_updated', { type: 'education' });
    res.json({ message: 'Education updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update education' });
  }
});

router.delete('/education/:id', verifyAdminToken, async (req, res) => {
  try {
    const success = await db.education.delete(req.params.id);
    if (!success) return res.status(404).json({ message: 'Education not found' });
    if (req.io) req.io.emit('portfolio_updated', { type: 'education' });
    res.json({ message: 'Education deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete education' });
  }
});

// ==========================================
// Certifications Endpoints
// ==========================================

router.post('/certifications', verifyAdminToken, async (req, res) => {
  try {
    const item = await db.certifications.create(req.body);
    if (req.io) req.io.emit('portfolio_updated', { type: 'certifications' });
    res.status(201).json({ message: 'Certification created successfully', data: item });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create certification' });
  }
});

router.put('/certifications/:id', verifyAdminToken, async (req, res) => {
  try {
    const updated = await db.certifications.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Certification not found' });
    if (req.io) req.io.emit('portfolio_updated', { type: 'certifications' });
    res.json({ message: 'Certification updated successfully', data: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update certification' });
  }
});

router.delete('/certifications/:id', verifyAdminToken, async (req, res) => {
  try {
    const success = await db.certifications.delete(req.params.id);
    if (!success) return res.status(404).json({ message: 'Certification not found' });
    if (req.io) req.io.emit('portfolio_updated', { type: 'certifications' });
    res.json({ message: 'Certification deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete certification' });
  }
});

// ==========================================
// Contact Form & Message Endpoints
// ==========================================

/**
 * Public route to submit contact messages
 */
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }
    
    // Store message in database
    const newMsg = await db.contacts.create({ name, email, subject, message });
    if (req.io) req.io.emit('new_contact_message', { id: newMsg.id });

    // Dispatch direct email notification to Dhamodharan
    const mailResult = await sendContactNotification({ name, email, subject, message });

    res.status(201).json({
      message: mailResult.sent
        ? `Delivered directly to ${mailResult.receiver} email inbox!`
        : `Message saved in dashboard. Direct email forwarding to ${mailResult.receiver} requires SMTP setup in .env.`,
      emailed: mailResult.sent,
      reason: mailResult.reason || mailResult.error,
      receiver: mailResult.receiver,
      mailtoUrl: mailResult.mailtoUrl
    });
  } catch (err) {
    console.error('Contact route error:', err);
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

/**
 * Admin protected routes to view/manage contact messages
 */
router.get('/contacts', verifyAdminToken, async (req, res) => {
  try {
    const messages = await db.contacts.getAll();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve messages.' });
  }
});

router.delete('/contacts/:id', verifyAdminToken, async (req, res) => {
  try {
    const success = await db.contacts.delete(req.params.id);
    if (!success) return res.status(404).json({ message: 'Message not found.' });
    res.json({ message: 'Message deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete message.' });
  }
});

export default router;
