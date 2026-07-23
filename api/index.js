import express from 'express';
import cors from 'cors';
import llmRoutes from './routes/llm.js';
import booksRoutes from './routes/books.js';
import charactersRoutes from './routes/characters.js';
import worldviewsRoutes from './routes/worldviews.js';
import storiesRoutes from './routes/stories.js';
import settingsRoutes from './routes/settings.js';

import './db.js'; // Initialize Firebase Admin

const app = express();

app.use(cors({
  origin: [/localhost:\d+/, /.*\.vercel\.app/],
  credentials: true,
}));
app.use(express.json());

// Master Password Middleware
export const authMiddleware = (req, res, next) => {
  const masterPassword = (process.env.MASTER_PASSWORD || '0000').trim();
  const token = (req.headers['x-auth-token'] || '').trim();
  
  // Exclude health check and root
  if (req.path === '/' || req.path === '/api/health') return next();

  if (token !== masterPassword) {
    return res.status(401).json({ detail: 'Invalid authentication token' });
  }
  next();
};

app.use('/api', authMiddleware);

app.post('/api/auth', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/health', (req, res) => {
  res.json({ message: 'Welcome to StoryForge API (Node.js)', status: 'healthy' });
});

app.use('/api/books', booksRoutes);
app.use('/api/characters', charactersRoutes);
app.use('/api/worldviews', worldviewsRoutes);
app.use('/api/stories', storiesRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/llm', llmRoutes); // Custom route for LLM logic if needed

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// Vercel Serverless Function export
export default app;

// Local development fallback
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Node.js Backend listening on port ${PORT}`);
  });
}
