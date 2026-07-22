import express from 'express';
import { prisma } from '../index.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 100;
    const items = await prisma.worldview.findMany({ skip, take: limit });
    res.json(items);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const item = await prisma.worldview.create({ data: req.body });
    res.json(item);
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const item = await prisma.worldview.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!item) return res.status(404).json({ detail: 'Not found' });
    res.json(item);
  } catch (e) { next(e); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const item = await prisma.worldview.update({ where: { id: parseInt(req.params.id) }, data: req.body });
    res.json(item);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const item = await prisma.worldview.delete({ where: { id: parseInt(req.params.id) } });
    res.json(item);
  } catch (e) { next(e); }
});

export default router;
