import { Router, Request, Response } from 'express';
import { storeManager } from '../store';

const router = Router();

// GET /api/products - Get all active products
router.get('/', (req: Request, res: Response) => {
  try {
    const products = storeManager.getProducts();
    const { category, woodType, maxPrice, sort, search } = req.query;

    let filtered = [...products];

    if (category && category !== 'all') {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (woodType && woodType !== 'all') {
      filtered = filtered.filter(
        (p) => p.woodType === woodType || (p.availableWoods && p.availableWoods.includes(woodType as string))
      );
    }

    if (maxPrice) {
      filtered = filtered.filter((p) => p.price <= Number(maxPrice));
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.woodType.toLowerCase().includes(q) ||
          p.features.some((f) => f.toLowerCase().includes(q))
      );
    }

    if (sort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    res.json({ success: true, count: filtered.length, products: filtered });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', (req: Request, res: Response) => {
  try {
    const product = storeManager.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/products - Add product (Admin)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, category, price } = req.body;
    if (!name || !category || !price) {
      return res.status(400).json({ success: false, error: 'Name, Category, and Price are required' });
    }

    const created = await storeManager.addProduct(req.body);
    res.status(201).json({ success: true, message: 'Product created and synced to Google Sheets', product: created });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/products/:id - Update product (Admin)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updated = await storeManager.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product updated successfully', product: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/products/:id - Delete product (Admin)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await storeManager.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, message: 'Product removed' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
