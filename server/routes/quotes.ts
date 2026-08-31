import { Router, Request, Response } from 'express';
import { storeManager } from '../store';

const router = Router();

// GET /api/quotes - Get all quote requests (Admin)
router.get('/', (req: Request, res: Response) => {
  try {
    const quotes = storeManager.getQuotes();
    res.json({ success: true, count: quotes.length, quotes });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/quotes - Submit new quote request
router.post('/', async (req: Request, res: Response) => {
  try {
    const { customerName, phone, itemType, width, height, preferredWood, quantity, location } = req.body;

    if (!customerName || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Name and Phone number are required to process your quote request.',
      });
    }

    const created = await storeManager.createQuote({
      customerName: req.body.customerName || req.body.name,
      phone: req.body.phone,
      email: req.body.email || '',
      itemType: req.body.itemType || req.body['Door/Window'] || 'Door',
      width: req.body.width || '',
      height: req.body.height || '',
      woodType: req.body.preferredWood || req.body.woodType || 'Burma Teak',
      designPreference: req.body.designPreference || 'Architectural Custom',
      finish: req.body.finish || 'Natural Matte',
      glassOption: req.body.glassOption || 'None (Solid Wood)',
      quantity: Number(req.body.quantity) || 1,
      location: req.body.location || 'India',
      additionalRequirements: req.body.additionalRequirements || req.body.additionalReqs || '',
      uploadedDesign: req.body.uploadedDesign || req.body.designPhotoName || '',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your quotation request has been received. Our team will contact you soon.',
      quote: created,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'Unable to save quotation request at this time. Please try again or reach out on WhatsApp.',
    });
  }
});

// PATCH /api/quotes/:id/status - Update quote status (Admin)
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required' });
    }

    const updated = await storeManager.updateQuoteStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Quote not found' });
    }

    res.json({ success: true, message: `Quote status updated to ${status}`, quote: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
