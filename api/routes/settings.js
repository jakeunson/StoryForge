import express from 'express';
import { db } from '../db.js';

const router = express.Router();
const settingsDoc = db.collection('settings').doc('global');

router.get('/', async (req, res, next) => {
  try {
    const doc = await settingsDoc.get();
    if (!doc.exists) {
      const defaultSettings = { theme: 'dark' };
      await settingsDoc.set(defaultSettings);
      return res.json(defaultSettings);
    }
    res.json(doc.data());
  } catch (e) { next(e); }
});

router.put('/', async (req, res, next) => {
  try {
    await settingsDoc.set(req.body, { merge: true });
    const updated = await settingsDoc.get();
    res.json(updated.data());
  } catch (e) { next(e); }
});

export default router;
