import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Edit3, Check } from 'lucide-react';
import { apiClient } from '../api/client';
import toast from 'react-hot-toast';

const StoryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const data = await apiClient.get(`/stories/${id}`);
        setStory(data);
        setEditedContent(data.content);
      } catch (error) {
        toast.error('스토리를 찾을 수 없습니다.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [id, navigate]);

  const handleSave = async () => {
    try {
      const updated = await apiClient.put(`/stories/${id}`, { ...story, content: editedContent });
      setStory(updated);
      setIsEditing(false);
      toast.success('스토리가 수정되었습니다.');
    } catch (e) {
      toast.error('저장에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('이 스토리를 영구적으로 삭제하시겠습니까?')) return;
    try {
      await apiClient.delete(`/stories/${id}`);
      toast.success('삭제되었습니다.');
      navigate('/');
    } catch (e) {
      toast.error('삭제에 실패했습니다.');
    }
  };

  if (loading) return <div>불러오는 중...</div>;
  if (!story) return null;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> 뒤로가기
        </button>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {isEditing ? (
            <button className="btn btn-primary" onClick={handleSave}>
              <Check size={16} /> 변경사항 저장
            </button>
          ) : (
            <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
              <Edit3 size={16} /> 수정
            </button>
          )}
          <button className="btn btn-danger" onClick={handleDelete}>
            <Trash2 size={16} /> 삭제
          </button>
        </div>
      </div>

      <div className="glass-card">
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
          {story.title}
        </h1>
        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
          생성일: {new Date(story.created_at).toLocaleString()}
        </div>

        {isEditing ? (
          <textarea
            className="input-field"
            style={{ minHeight: '500px', fontSize: '1rem', lineHeight: '1.6', fontFamily: 'inherit' }}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
        ) : (
          <div style={{ fontSize: '1rem', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
            {story.content}
          </div>
        )}
      </div>
      
      <div className="glass-panel" style={{ marginTop: '2rem', padding: '1.5rem' }}>
        <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-muted)' }}>프롬프트 내용</h4>
        <div style={{ fontSize: '0.9rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
          <strong>프롬프트:</strong> {story.prompt}
        </div>
      </div>
    </div>
  );
};

export default StoryView;
