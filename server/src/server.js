import dns from 'node:dns';
dns.setServers(['1.1.1.1', '1.0.0.1']);
import express from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import portfolioRoutes from './routes/portfolio.js';
import aiRoutes from './routes/ai.js';
import uploadRoutes from './routes/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables (from cwd and fallback to root .env)
dotenv.config();
const rootEnvPath = path.join(__dirname, '..', '..', '.env');
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
}

const app = express();
const server = http.createServer(app);

// Configure CORS to support Next.js development and production
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'Origin']
}));
app.options('*', cors());
app.use(express.json());

// Ensure the public upload directory is served statically
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const UPLOAD_DIR = path.join(PUBLIC_DIR, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOAD_DIR, {
  setHeaders: (res, path, stat) => {
    const filename = path.split(/[\\/]/).pop();
    // Match our filename format: fieldname-timestamp-random-originalname
    const match = filename.match(/^\\w+-\\d+-\\d+-(.+)$/);
    const originalName = match ? match[1] : filename;
    // URL encode the filename to handle spaces and special characters properly
    const encodedName = encodeURIComponent(originalName);
    res.setHeader('Content-Disposition', `inline; filename="${encodedName}"; filename*=UTF-8''${encodedName}`);
  }
}));

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`Socket client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`Socket client disconnected: ${socket.id}`);
  });
});

// Inject io instance into the requests so routers can emit events
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    time: new Date(),
    aiConfigured: !!(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY)
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal Server Error.' 
  });
});

const PORT = process.env.PORT || 5005;

// Connect Database first, then start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    console.error(`Server error on port ${PORT}:`, err);
  });
}).catch(err => {
  console.error('Database connection failed. Express server not started:', err);
});
