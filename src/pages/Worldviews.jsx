import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { apiClient } from '../api/client';
import toast from 'react-hot-toast';

const WorldviewForm = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '', core_theme: '', system_and_laws: '', 
    absolute_rules: '', social_conflicts: '', key_locations: []
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
      <h3 style={{ marginBottom: '1.5rem' }}>{initialData ? '세계관 수정' : '새 세계관 추가'}</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label className="form-label">세계관 이름 *</label>
          <input name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="예: 2099 네오 서울" />
        </div>
        
        <div>
          <label className="form-label">핵심 테마</label>
          <input name="core_theme" value={formData.core_theme} onChange={handleChange} className="input-field" placeholder="예: 사이버펑크, 다크 판타지, 디스토피아" />
        </div>

        <div>
          <label className="form-label">시스템 및 물리 법칙</label>
          <textarea name="system_and_laws" value={formData.system_and_laws} onChange={handleChange} className="input-field" placeholder="마법 시스템, 기술적 한계 등" style={{ minHeight: '80px' }}/>
        </div>
        
        <div>
          <label className="form-label">절대 규칙</label>
          <textarea name="absolute_rules" value={formData.absolute_rules} onChange={handleChange} className="input-field" placeholder="이 세계에서 절대 깨질 수 없는 규칙은?" style={{ minHeight: '80px' }}/>
        </div>
        
        <div>
          <label className="form-label">사회/문화 갈등 요소</label>
          <textarea name="social_conflicts" value={formData.social_conflicts} onChange={handleChange} className="input-field" placeholder="파벌, 정치, 사회적 문제" style={{ minHeight: '80px' }}/>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onCancel} className="btn btn-secondary">취소</button>
          <button type="submit" className="btn btn-primary">세계관 저장</button>
        </div>
      </form>
    </div>
  );
};

const Worldviews = () => {
  const [worldviews, setWorldviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingWorld, setEditingWorld] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchWorldviews = async () => {
    try {
      const data = await apiClient.get('/worldviews');
      setWorldviews(data);
    } catch (error) {
      toast.error('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorldviews();
  }, []);

  const handleSave = async (data) => {
    try {
      if (data.id) {
        await apiClient.put(`/worldviews/${data.id}`, data);
        toast.success('세계관 정보가 수정되었습니다.');
      } else {
        await apiClient.post('/worldviews', data);
        toast.success('새 세계관이 생성되었습니다.');
      }
      setShowForm(false);
      setEditingWorld(null);
      fetchWorldviews();
    } catch (error) {
      toast.error('저장에 실패했습니다.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('이 세계관을 정말 삭제하시겠습니까?')) return;
    try {
      await apiClient.delete(`/worldviews/${id}`);
      toast.success('삭제되었습니다.');
      fetchWorldviews();
    } catch (error) {
      toast.error('삭제에 실패했습니다.');
    }
  };

  if (loading) return <div>불러오는 중...</div>;

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h2 className="page-title text-gradient" style={{ margin: 0 }}>세계관 관리</h2>
        <button className="btn btn-primary" onClick={() => { setEditingWorld(null); setShowForm(true); }}>
          <Plus size={18} /> 새 세계관 추가
        </button>
      </div>

      {showForm ? (
        <div style={{ marginBottom: '2rem' }}>
          <WorldviewForm 
            initialData={editingWorld} 
            onSave={handleSave} 
            onCancel={() => { setShowForm(false); setEditingWorld(null); }} 
          />
        </div>
      ) : null}

      <div className="grid-2">
        {worldviews.map(world => (
          <div key={world.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="flex-between" style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#10b981' }}>{world.name}</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => { setEditingWorld(world); setShowForm(true); }} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(world.id)} style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}><Trash2 size={16} /></button>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
              <strong>테마:</strong> {world.core_theme || '없음'} <br/>
              <strong>법칙:</strong> {world.system_and_laws || '없음'}
            </p>
          </div>
        ))}
        {worldviews.length === 0 && !showForm && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
            등록된 세계관이 없습니다. 새로운 세계를 창조해보세요!
          </div>
        )}
      </div>
    </div>
  );
};

export default Worldviews;
