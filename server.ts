import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import productsRouter from './server/routes/products';
import ordersRouter from './server/routes/orders';
import quotesRouter from './server/routes/quotes';
import contactRouter from './server/routes/contact';
import reviewsRouter from './server/routes/reviews';
import adminRouter from './server/routes/admin';
import settingsRouter from './server/routes/settings';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Basic Middlewares
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'WOODCRAFT Timber API',
      timestamp: new Date().toISOString(),
    });
  });

  // REST API Routes
  app.use('/api/products', productsRouter);
  app.use('/api/orders', ordersRouter);
  app.use('/api/quotes', quotesRouter);
  app.use('/api/contact', contactRouter);
  app.use('/api/reviews', reviewsRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/settings', settingsRouter);

  // Vite middleware for development vs Static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[WOODCRAFT Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
