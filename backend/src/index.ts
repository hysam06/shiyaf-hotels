import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { supabase } from './config/supabase.config';
import guestRoutes from './routes/guest.routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/v1/guests', guestRoutes);

// Root API endpoint
app.get('/api/v1', (req, res) => {
  res.json({ 
    message: 'Shiyaf Hotels Guest Registration API',
    version: '1.0.0',
    properties: ['Plaza Residency', 'Century Residency'],
    whatsappEnabled: process.env.WHATSAPP_ENABLED === 'true',
    endpoints: {
      guests: {
        create: 'POST /api/v1/guests',
        list: 'GET /api/v1/guests',
        get: 'GET /api/v1/guests/:id',
        update: 'PUT /api/v1/guests/:id',
        delete: 'DELETE /api/v1/guests/:id',
        checkout: 'POST /api/v1/guests/:id/checkout',
        today: 'GET /api/v1/guests/today?property=plaza',
        search: 'GET /api/v1/guests/search?q=term',
        stats: 'GET /api/v1/guests/stats?property=plaza'
      }
    }
  });
});

// Supabase test endpoint
app.get('/api/v1/test-supabase', async (req, res) => {
  try {
    // Test database connection
    const { data, error } = await supabase
      .from('guest_records')
      .select('count')
      .limit(1);

    if (error) throw error;

    // Test storage connection
    const { data: buckets, error: storageError } = await supabase
      .storage
      .listBuckets();

    if (storageError) throw storageError;

    res.json({
      success: true,
      message: 'Supabase connection successful!',
      database: 'Connected',
      storage: 'Connected',
      buckets: buckets?.map(b => b.name) || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Supabase test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Supabase connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    code: 'NOT_FOUND',
    message: 'Endpoint not found',
    timestamp: new Date().toISOString(),
  });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🏨 Shiyaf Hotels Backend Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  });
}

export default app;
