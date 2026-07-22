import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, Trash2, Edit2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import toast from 'react-hot-toast';

const BookForm = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ title: '', description: '' });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return toast.error('제목을 입력해주세요');
    onSave(formData);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', position: 'relative', marginBottom: '2rem' }}>
      <button onClick={onCancel} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--color-text-main)', cursor: 'pointer' }}>
        <X size={24} />
      </button>
      <h3 style={{ marginBottom: '1.5rem' }}>{initialData ? '책 정보 수정' : '새 책 만들기'}</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label className="form-label">책 제목 *</label>
          <input name="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-field" placeholder="예: 얼음과 불의 노래" />
        </div>
        <div>
          <label className="form-label">설명</label>
          <textarea name="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field" placeholder="이 책은 어떤 이야기들을 담고 있나요?" style={{ minHeight: '80px' }}/>
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onCancel} className="btn btn-secondary">취소</button>
          <button type="submit" className="btn btn-primary">저장하기</button>
        </div>
      </form>
    </div>
  );
};

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const fetchBooks = async () => {
    try {
      const data = await apiClient.get('/books');
      setBooks(data);
    } catch (e) {
      toast.error('책 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSave = async (data) => {
    try {
      if (data.id) {
        await apiClient.put(`/books/${data.id}`, data);
        toast.success('수정되었습니다.');
      } else {
        await apiClient.post('/books', data);
        toast.success('새 책이 생성되었습니다.');
      }
      setShowForm(false);
      setEditingBook(null);
      fetchBooks();
    } catch (error) {
      toast.error('저장에 실패했습니다.');
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault(); // prevent navigation
    if (!window.confirm('정말 삭제하시겠습니까? 안에 있는 스토리들은 삭제되지 않고 소속만 해제됩니다.')) return;
    try {
      await apiClient.delete(`/books/${id}`);
      toast.success('삭제되었습니다.');
      fetchBooks();
    } catch (error) {
      toast.error('삭제에 실패했습니다.');
    }
  };

  if (loading) return <div>불러오는 중...</div>;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h2 className="page-title text-gradient" style={{ margin: 0 }}>내 서재 (Books)</h2>
        <button className="btn btn-primary" onClick={() => { setEditingBook(null); setShowForm(true); }}>
          <Plus size={18} /> 새 책 만들기
        </button>
      </div>

      {showForm && (
        <BookForm 
          initialData={editingBook} 
          onSave={handleSave} 
          onCancel={() => { setShowForm(false); setEditingBook(null); }} 
        />
      )}

      <div className="grid-3">
        {books.map(book => (
          <Link to={`/books/${book.id}`} key={book.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
                  <BookOpen size={20} />
                  <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{book.title}</h3>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={(e) => { e.preventDefault(); setEditingBook(book); setShowForm(true); }} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><Edit2 size={16} /></button>
                  <button onClick={(e) => handleDelete(book.id, e)} style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}><Trash2 size={16} /></button>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', flex: 1 }}>
                {book.description || '설명이 없습니다.'}
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '1rem' }}>
                생성일: {new Date(book.created_at).toLocaleDateString()}
              </div>
            </div>
          </Link>
        ))}
        {books.length === 0 && !showForm && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
            아직 만들어진 책이 없습니다. 새 책을 만들어 스토리를 엮어보세요!
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;
