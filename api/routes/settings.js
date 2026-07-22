import express from 'express';
import { prisma } from '../index.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    let setting = await prisma.setting.findFirst();
    if (!setting) {
      setting = await prisma.setting.create({ data: {} });
    }
    res.json(setting);
  } catch (e) { next(e); }
});

router.put('/', async (req, res, next) => {
  try {
    let setting = await prisma.setting.findFirst();
    if (!setting) {
      setting = await prisma.setting.create({ data: req.body });
    } else {
      setting = await prisma.setting.update({ where: { id: setting.id }, data: req.body });
    }
    res.json(setting);
  } catch (e) { next(e); }
});

export default router;
