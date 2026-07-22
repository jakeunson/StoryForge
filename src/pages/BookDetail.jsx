import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, FileText, ChevronRight } from 'lucide-react';
import { apiClient } from '../api/client';
import toast from 'react-hot-toast';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const [bookData, storiesData] = await Promise.all([
          apiClient.get(`/books/${id}`),
          apiClient.get(`/stories?book_id=${id}`) // Requires backend to support this query param
        ]);
        setBook(bookData);
        setStories(storiesData);
      } catch (e) {
        toast.error('책 정보를 불러올 수 없습니다.');
        navigate('/books');
      } finally {
        setLoading(false);
      }
    };
    fetchBookData();
  }, [id, navigate]);

  if (loading) return <div>불러오는 중...</div>;
  if (!book) return null;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/books')}>
          <ArrowLeft size={16} /> 내 서재로 돌아가기
        </button>
        <Link to={`/generate?book_id=${book.id}`} className="btn btn-primary">
          <Plus size={16} /> 이 책에 새 스토리 작성
        </Link>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>{book.title}</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)' }}>{book.description || '설명이 없습니다.'}</p>
      </div>

      <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>수록된 스토리 ({stories.length})</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {stories.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
            이 책에 수록된 스토리가 없습니다. 새 스토리를 작성해보세요!
          </div>
        ) : (
          stories.map((story, idx) => (
            <Link to={`/stories/${story.id}`} key={story.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="glass-card flex-between" style={{ padding: '1.25rem 1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '8px' }}>
                    <FileText size={24} color="var(--color-secondary)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{idx + 1}. {story.title}</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                      생성일: {new Date(story.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <ChevronRight size={20} color="var(--color-text-muted)" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default BookDetail;
