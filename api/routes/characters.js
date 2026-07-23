import express from 'express';
import { db } from '../db.js';

const router = express.Router();
const collection = db.collection('characters');

router.get('/', async (req, res, next) => {
  try {
    let query = collection;
    if (req.query.bookId) {
      query = query.where('bookId', '==', req.query.bookId);
    }
    const snapshot = await query.orderBy('createdAt', 'desc').get();
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(items);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const data = { ...req.body, createdAt: new Date().toISOString() };
    const docRef = await collection.add(data);
    res.json({ id: docRef.id, ...data });
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const doc = await collection.doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ detail: 'Not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (e) { next(e); }
});

router.put('/:id', async (req, res, next) => {
  try {
    await collection.doc(req.params.id).update(req.body);
    const updated = await collection.doc(req.params.id).get();
    res.json({ id: updated.id, ...updated.data() });
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await collection.doc(req.params.id).delete();
    res.json({ id: req.params.id, deleted: true });
  } catch (e) { next(e); }
});

export default router;
