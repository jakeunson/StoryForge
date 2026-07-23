import express from 'express';
import { db } from '../db.js';
import { generateStoryWithLLM } from '../services/llm.js';

const router = express.Router();
const collection = db.collection('stories');
const settingsDoc = db.collection('settings').doc('global');

router.get('/', async (req, res, next) => {
  try {
    const snapshot = await collection.orderBy('createdAt', 'desc').get();
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

router.post('/:id/generate', async (req, res, next) => {
  try {
    const storyId = req.params.id;
    const doc = await collection.doc(storyId).get();
    if (!doc.exists) return res.status(404).json({ detail: 'Story not found' });
    const story = doc.data();
    
    const sDoc = await settingsDoc.get();
    if (!sDoc.exists) return res.status(400).json({ detail: 'Settings not configured' });
    const settings = sDoc.data();
    
    // Call LLM
    const provider = req.body.llmProvider || story.llmProvider || 'gemini';
    const prompt = req.body.prompt || story.prompt;
    
    const content = await generateStoryWithLLM(provider, prompt, settings);
    
    await collection.doc(storyId).update({ content: content, llmProvider: provider });
    const updated = await collection.doc(storyId).get();
    
    res.json({ id: updated.id, ...updated.data() });
  } catch (e) { next(e); }
});

export default router;
