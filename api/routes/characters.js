import express from 'express';
import { prisma } from '../index.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 100;
    const items = await prisma.character.findMany({ skip, take: limit });
    res.json(items);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const item = await prisma.character.create({ data: req.body });
    res.json(item);
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const item = await prisma.character.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!item) return res.status(404).json({ detail: 'Not found' });
    res.json(item);
  } catch (e) { next(e); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const item = await prisma.character.update({ where: { id: parseInt(req.params.id) }, data: req.body });
    res.json(item);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const item = await prisma.character.delete({ where: { id: parseInt(req.params.id) } });
    res.json(item);
  } catch (e) { next(e); }
});

export default router;
