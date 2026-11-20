import express from 'express';
import multer from 'multer';
import { PDFDocument } from 'pdf-lib';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { verifyAdminToken } from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '..', '..', 'public');
const UPLOAD_DIR = path.join(PUBLIC_DIR, 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + baseName + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp|svg|pdf|docx|txt/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images, PDFs, Word, or TXT documents are allowed.'));
  }
});

async function stripPdfMetadata(filePath, originalName) {
  try {
    if (!filePath.toLowerCase().endsWith('.pdf')) return;
    const existingPdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes, { ignoreEncryption: true });
    
    // Clear all standard metadata
    pdfDoc.setTitle(originalName);
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer('');
    pdfDoc.setCreator('');
    
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(filePath, pdfBytes);
  } catch (error) {
    console.error('Failed to strip PDF metadata:', error);
  }
}

/**
 * Admin protected file upload endpoint
 */
router.post('/', verifyAdminToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    await stripPdfMetadata(req.file.path, req.file.originalname);
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ fileUrl });
  } catch (err) {
    res.status(500).json({ message: err.message || 'File upload failed.' });
  }
});

/**
 * Admin protected multiple files upload endpoint
 */
router.post('/multiple', verifyAdminToken, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded.' });
    }
    await Promise.all(req.files.map(file => stripPdfMetadata(file.path, file.originalname)));
    const fileUrls = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ fileUrls });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Files upload failed.' });
  }
});

export default router;
