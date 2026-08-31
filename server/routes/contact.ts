import { Router, Request, Response } from 'express';
import { storeManager } from '../store';

const router = Router();

// GET /api/contact - Get contact messages (Admin)
router.get('/', (req: Request, res: Response) => {
  try {
    const contacts = storeManager.getContacts();
    res.json({ success: true, count: contacts.length, contacts });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/contact - Submit contact form
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, phone, email, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, Phone, and Message are required.',
      });
    }

    const created = await storeManager.createContact({ name, phone, email, message });
    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to WOODCRAFT. Our master carpenter and design team will contact you shortly.',
      contact: created,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/contact/:id/status - Update message status (Admin)
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const updated = await storeManager.updateContactStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Contact message not found' });
    }
    res.json({ success: true, message: 'Message status updated', contact: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
