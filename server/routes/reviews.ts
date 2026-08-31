import { Router, Request, Response } from 'express';
import { storeManager } from '../store';

const router = Router();

// GET /api/reviews - Get only approved reviews for public display
router.get('/', (req: Request, res: Response) => {
  try {
    const approved = storeManager.getApprovedReviews();
    res.json({ success: true, count: approved.length, reviews: approved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/reviews/all - Get all reviews including pending/rejected (Admin)
router.get('/all', (req: Request, res: Response) => {
  try {
    const all = storeManager.getAllReviews();
    res.json({ success: true, count: all.length, reviews: all });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/reviews - Submit a new review
router.post('/', async (req: Request, res: Response) => {
  try {
    const { customerName, product, rating, review, city, image } = req.body;

    if (!customerName || !product || !rating || !review) {
      return res.status(400).json({
        success: false,
        error: 'Name, Product, Rating, and Review text are required.',
      });
    }

    const created = await storeManager.createReview({
      customerName,
      product,
      rating: Number(rating),
      review,
      city: city || 'India',
      image: image || '',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for sharing your experience! Your review has been submitted for moderation and will appear once verified.',
      review: created,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/reviews/:id/status - Approve or reject review (Admin)
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status || !['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Valid status (Approved, Rejected, Pending) is required' });
    }

    const updated = await storeManager.updateReviewStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    res.json({ success: true, message: `Review status marked as ${status}`, review: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
