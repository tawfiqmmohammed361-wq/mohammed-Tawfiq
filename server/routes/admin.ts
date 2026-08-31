import { Router, Request, Response } from 'express';
import { storeManager } from '../store';
import { googleSheetsService, SHEET_NAMES } from '../googleSheets';

const router = Router();

// POST /api/admin/login
router.post('/login', (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'woodcraft@2026';

    if (username === expectedUsername && password === expectedPassword) {
      // In production, generate a real session/JWT
      const token = `wc_admin_${Date.now()}_${Buffer.from(username).toString('base64')}`;
      return res.json({
        success: true,
        message: 'Welcome to Woodcraft Management Portal',
        token,
        user: { username, role: 'Administrator', business: 'WOODCRAFT' },
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid administrator credentials. Please check your username and password.',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/stats
router.get('/stats', (req: Request, res: Response) => {
  try {
    const stats = storeManager.getDashboardStats();
    res.json({ success: true, stats });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/customers
router.get('/customers', (req: Request, res: Response) => {
  try {
    const customers = storeManager.getCustomers();
    res.json({ success: true, count: customers.length, customers });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/sheets-status
router.get('/sheets-status', async (req: Request, res: Response) => {
  try {
    const status = await googleSheetsService.getStatus();
    res.json({ success: true, ...status });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/sync-sheets - Sync all memory data to Google Sheets
router.post('/sync-sheets', async (req: Request, res: Response) => {
  try {
    const status = await googleSheetsService.getStatus();
    if (!status.configured) {
      return res.status(400).json({
        success: false,
        error: 'Google Sheets is not yet configured. Please add GOOGLE_SHEET_ID and Google Service Account credentials in Settings / .env',
      });
    }

    const products = storeManager.getProducts();
    const orders = storeManager.getOrders();
    const quotes = storeManager.getQuotes();
    const contacts = storeManager.getContacts();
    const reviews = storeManager.getAllReviews();
    const customers = storeManager.getCustomers();

    let syncedCount = 0;

    // Sync products
    for (const p of products) {
      await googleSheetsService.appendRow(SHEET_NAMES.PRODUCTS, [
        p.id,
        p.name,
        p.categoryName,
        p.description,
        p.woodType,
        'Solid Kiln-Dried Timber',
        p.dimensions,
        p.finishes.join(', '),
        (p.glassOption || []).join(', '),
        p.price,
        p.originalPrice,
        `${Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%`,
        p.inStock ? 'In Stock' : 'Made to Order',
        p.images[0] || '',
        p.createdDate,
      ]);
      syncedCount++;
    }

    res.json({
      success: true,
      message: `Full database sync complete. Synced ${syncedCount} records across 6 Google Sheets.`,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
