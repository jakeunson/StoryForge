import express from 'express';
import { prisma } from '../index.js';
import { generateStoryWithLLM } from '../services/llm.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 100;
    const items = await prisma.story.findMany({ skip, take: limit });
    res.json(items);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const item = await prisma.story.create({ data: req.body });
    res.json(item);
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const item = await prisma.story.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!item) return res.status(404).json({ detail: 'Not found' });
    res.json(item);
  } catch (e) { next(e); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const item = await prisma.story.update({ where: { id: parseInt(req.params.id) }, data: req.body });
    res.json(item);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const item = await prisma.story.delete({ where: { id: parseInt(req.params.id) } });
    res.json(item);
  } catch (e) { next(e); }
});

router.post('/:id/generate', async (req, res, next) => {
  try {
    const storyId = parseInt(req.params.id);
    const story = await prisma.story.findUnique({ where: { id: storyId } });
    if (!story) return res.status(404).json({ detail: 'Story not found' });
    
    const settings = await prisma.setting.findFirst();
    if (!settings) return res.status(400).json({ detail: 'Settings not configured' });
    
    // Call LLM
    const provider = req.body.llmProvider || story.llmProvider || 'gemini';
    const prompt = req.body.prompt || story.prompt;
    
    const content = await generateStoryWithLLM(provider, prompt, settings);
    
    const updated = await prisma.story.update({
      where: { id: storyId },
      data: { content: content, llmProvider: provider }
    });
    
    res.json(updated);
  } catch (e) { next(e); }
});

export default router;
