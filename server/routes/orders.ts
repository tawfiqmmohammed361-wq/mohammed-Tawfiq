import { Router, Request, Response } from 'express';
import { storeManager } from '../store';

const router = Router();

// POST /api/orders - Place a new order
router.post('/', async (req: Request, res: Response) => {
  try {
    const { customerName, phone, email, address, city, state, pincode, items, subtotal, total } = req.body;

    if (!customerName || !phone || !address || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide full customer name, phone, delivery address, and at least one item.',
      });
    }

    const order = await storeManager.createOrder(req.body);
    res.status(201).json({
      success: true,
      message: 'Order confirmed successfully! Logged to joinery queue and Google Sheets.',
      order,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/orders/track - Track order by ID and phone
router.get('/track', (req: Request, res: Response) => {
  try {
    const { orderId, phone } = req.query;
    if (!orderId || !phone || typeof orderId !== 'string' || typeof phone !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Please provide both your Order ID and registered Phone Number.',
      });
    }

    const order = storeManager.findOrder(orderId, phone);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'No order found matching this Order ID and Phone Number. Please check your credentials or contact Woodcraft Support.',
      });
    }

    res.json({ success: true, order });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/orders - Get all orders (Admin)
router.get('/', (req: Request, res: Response) => {
  try {
    const orders = storeManager.getOrders();
    res.json({ success: true, count: orders.length, orders });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/orders/:id/status - Update order status (Admin)
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status, note } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required' });
    }

    const updated = await storeManager.updateOrderStatus(req.params.id, status, note);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({ success: true, message: `Order status updated to ${status}`, order: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
