import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../components/Layout';
import { apiClient } from '../api/client';
import toast from 'react-hot-toast';
import { Moon, Sun, Save } from 'lucide-react';

const Settings = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    geminiApiKey: '',
    groqApiKey: '',
    cohereApiKey: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await apiClient.get('/settings');
        setFormData({
          geminiApiKey: data.geminiApiKey || '',
          groqApiKey: data.groqApiKey || '',
          cohereApiKey: data.cohereApiKey || ''
        });
      } catch (e) {
        toast.error('설정을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put('/settings', formData);
      toast.success('설정이 저장되었습니다.');
    } catch (e) {
      toast.error('설정 저장에 실패했습니다.');
    }
  };

  if (loading) return <div>불러오는 중...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="page-title text-gradient">설정 (Settings)</h2>

      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>테마 설정</h3>
        <div className="flex-between" style={{ background: 'var(--color-bg-base)', padding: '1rem', borderRadius: '8px' }}>
          <div>
            <div style={{ fontWeight: 500 }}>화면 모드</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>현재 모드: {theme === 'dark' ? '다크 모드' : '라이트 모드'}</div>
          </div>
          <button className="btn btn-secondary" onClick={toggleTheme}>
            {theme === 'dark' ? <><Sun size={18}/> 라이트 모드로 전환</> : <><Moon size={18}/> 다크 모드로 전환</>}
          </button>
        </div>
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: '1rem' }}>API 키 설정</h3>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Gemini API Key</label>
            <input type="password" name="geminiApiKey" value={formData.geminiApiKey} onChange={handleChange} className="input-field" placeholder="AI Studio에서 발급받은 키 입력" />
          </div>
          <div>
            <label className="form-label">Groq API Key</label>
            <input type="password" name="groqApiKey" value={formData.groqApiKey} onChange={handleChange} className="input-field" placeholder="Groq Cloud에서 발급받은 키 입력" />
          </div>
          <div>
            <label className="form-label">Cohere API Key</label>
            <input type="password" name="cohereApiKey" value={formData.cohereApiKey} onChange={handleChange} className="input-field" placeholder="Cohere Dashboard에서 발급받은 키 입력" />
          </div>

          <div style={{ marginTop: '1rem', textAlign: 'right' }}>
            <button type="submit" className="btn btn-primary">
              <Save size={18} /> 저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
