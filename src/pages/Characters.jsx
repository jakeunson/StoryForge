import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { apiClient } from '../api/client';
import toast from 'react-hot-toast';

const CharacterForm = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '', nickname: '', role: '', main_objective: '',
    fatal_flaw: '', constraints: '', appearance_and_skills: '',
    relationships: []
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return toast.error('이름을 입력해주세요');
    onSave(formData);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', position: 'relative' }}>
      <button onClick={onCancel} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
        <X size={24} />
      </button>
      <h3 style={{ marginBottom: '1.5rem' }}>{initialData ? '인물 수정' : '새 인물 추가'}</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="grid-2" style={{ gap: '1rem' }}>
          <div>
            <label className="form-label">이름 *</label>
            <input name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="홍길동" />
          </div>
          <div>
            <label className="form-label">별명</label>
            <input name="nickname" value={formData.nickname} onChange={handleChange} className="input-field" placeholder="길동이" />
          </div>
          <div>
            <label className="form-label">역할군</label>
            <select name="role" value={formData.role} onChange={handleChange} className="input-field">
              <option value="">역할 선택</option>
              <option value="주인공">주인공</option>
              <option value="적대자">적대자</option>
              <option value="조력자">조력자</option>
              <option value="멘토">멘토</option>
            </select>
          </div>
        </div>

        <div>
          <label className="form-label">절대적 목표</label>
          <textarea name="main_objective" value={formData.main_objective} onChange={handleChange} className="input-field" placeholder="이 인물의 궁극적인 목표는 무엇인가요?" style={{ minHeight: '60px' }}/>
        </div>
        <div>
          <label className="form-label">치명적 약점</label>
          <textarea name="fatal_flaw" value={formData.fatal_flaw} onChange={handleChange} className="input-field" placeholder="어떤 치명적인 약점을 가지고 있나요?" style={{ minHeight: '60px' }}/>
        </div>
        <div>
          <label className="form-label">행동 제약 / 금기</label>
          <textarea name="constraints" value={formData.constraints} onChange={handleChange} className="input-field" placeholder="절대 해서는 안 될 행동이나 금기가 있나요?" style={{ minHeight: '60px' }}/>
        </div>
        <div>
          <label className="form-label">핵심 외형 및 특기</label>
          <textarea name="appearance_and_skills" value={formData.appearance_and_skills} onChange={handleChange} className="input-field" placeholder="외형과 특별한 능력을 묘사해주세요" />
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onCancel} className="btn btn-secondary">취소</button>
          <button type="submit" className="btn btn-primary">인물 저장</button>
        </div>
      </form>
    </div>
  );
};

const Characters = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingChar, setEditingChar] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchCharacters = async () => {
    try {
      const data = await apiClient.get('/characters');
      setCharacters(data);
    } catch (error) {
      toast.error('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const handleSave = async (data) => {
    try {
      if (data.id) {
        await apiClient.put(`/characters/${data.id}`, data);
        toast.success('인물 정보가 수정되었습니다.');
      } else {
        await apiClient.post('/characters', data);
        toast.success('새 인물이 생성되었습니다.');
      }
      setShowForm(false);
      setEditingChar(null);
      fetchCharacters();
    } catch (error) {
      toast.error('저장에 실패했습니다.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('이 인물을 정말 삭제하시겠습니까?')) return;
    try {
      await apiClient.delete(`/characters/${id}`);
      toast.success('삭제되었습니다.');
      fetchCharacters();
    } catch (error) {
      toast.error('삭제에 실패했습니다.');
    }
  };

  if (loading) return <div>불러오는 중...</div>;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h2 className="page-title text-gradient" style={{ margin: 0 }}>인물 관리</h2>
        <button className="btn btn-primary" onClick={() => { setEditingChar(null); setShowForm(true); }}>
          <Plus size={18} /> 새 인물 추가
        </button>
      </div>

      {showForm ? (
        <div style={{ marginBottom: '2rem' }}>
          <CharacterForm 
            initialData={editingChar} 
            onSave={handleSave} 
            onCancel={() => { setShowForm(false); setEditingChar(null); }} 
          />
        </div>
      ) : null}

      <div className="grid-3">
        {characters.map(char => (
          <div key={char.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>{char.name}</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => { setEditingChar(char); setShowForm(true); }} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(char.id)} style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}><Trash2 size={16} /></button>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
              <strong>역할:</strong> {char.role || '없음'} <br/>
              <strong>목표:</strong> {char.main_objective || '없음'}
            </p>
          </div>
        ))}
        {characters.length === 0 && !showForm && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
            등록된 인물이 없습니다. 새 인물을 추가해보세요!
          </div>
        )}
      </div>
    </div>
  );
};

export default Characters;
