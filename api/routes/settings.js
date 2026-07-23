import express from 'express';
import { getDb } from '../db.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const settingsDoc = getDb().collection('settings').doc('global');
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
    const settingsDoc = getDb().collection('settings').doc('global');
    await settingsDoc.set(req.body, { merge: true });
    const updated = await settingsDoc.get();
    res.json(updated.data());
  } catch (e) { next(e); }
});

export default router;
