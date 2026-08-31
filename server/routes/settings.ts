import { Router, Request, Response } from 'express';
import { storeManager } from '../store';

const router = Router();

// GET /api/settings - Get public business settings
router.get('/', (req: Request, res: Response) => {
  try {
    const settings = storeManager.getSettings();
    res.json({ success: true, settings });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/settings - Update business settings (Admin)
router.put('/', (req: Request, res: Response) => {
  try {
    const updated = storeManager.updateSettings(req.body);
    res.json({ success: true, message: 'Showroom settings updated successfully', settings: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
