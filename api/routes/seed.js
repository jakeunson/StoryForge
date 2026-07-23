import express from 'express';
import { getDb } from '../db.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const db = getDb();
    const batch = db.batch();

    // 1. Create a dummy book
    const bookRef = db.collection('books').doc();
    batch.set(bookRef, {
      title: '첫 번째 판타지 소설',
      description: '용사와 마왕의 이야기입니다.',
      author: 'jakeunson',
      genre: '판타지',
      status: '연재중',
      coverImage: 'https://images.unsplash.com/photo-1629196914282-e25f828ff799?auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString()
    });

    // 2. Create dummy characters for this book
    const char1Ref = db.collection('characters').doc();
    batch.set(char1Ref, {
      bookId: bookRef.id,
      name: '아론',
      role: '주인공',
      description: '평범한 마을 청년이었으나 성검의 선택을 받았다.',
      appearance: '검은 머리칼, 맑은 갈색 눈동자',
      personality: '정의롭고 따뜻하지만 가끔 다혈질이다.',
      createdAt: new Date().toISOString()
    });

    const char2Ref = db.collection('characters').doc();
    batch.set(char2Ref, {
      bookId: bookRef.id,
      name: '벨라',
      role: '조력자',
      description: '왕궁 소속 엘프 마법사. 아론을 돕는다.',
      appearance: '은빛 머리칼, 날카로운 푸른 눈',
      personality: '냉철하고 이성적이며 완벽주의자.',
      createdAt: new Date().toISOString()
    });

    // 3. Create a dummy worldview
    const worldRef = db.collection('worldviews').doc();
    batch.set(worldRef, {
      bookId: bookRef.id,
      name: '에르테아 대륙',
      description: '마법과 정령이 숨쉬는 거대한 대륙. 중앙에는 세계수가 있다.',
      createdAt: new Date().toISOString()
    });

    // 4. Create a dummy story
    const storyRef = db.collection('stories').doc();
    batch.set(storyRef, {
      title: '1화: 성검의 각성',
      content: '아론은 여느 때와 다름없이 장작을 패고 있었다. 그때, 뒷산에서 기분 나쁜 마력이 느껴졌다. 급히 달려간 곳에는 바위에 꽂힌 낡은 검 한 자루가 빛을 내고 있었다...',
      prompt: '주인공 아론이 성검을 발견하는 첫 장면을 판타지 소설 톤으로 써줘.',
      llmProvider: 'gemini',
      createdAt: new Date().toISOString()
    });

    await batch.commit();

    res.json({ ok: true, message: '더미 데이터가 성공적으로 생성되었습니다!' });
  } catch (e) {
    next(e);
  }
});

export default router;
