import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { apiClient } from '../api/client';
import toast from 'react-hot-toast';

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Temporarily save to local storage to let the client use it for this request
      localStorage.setItem('storyforge_token', password);
      
      // Verify against the backend /api/auth endpoint
      await apiClient.post('/auth', {});
      
      toast.success('접속되었습니다.');
      onLogin(true);
    } catch (error) {
      console.error(error);
      localStorage.removeItem('storyforge_token');
      toast.error('비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      background: 'var(--color-bg)'
    }}>
      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '3rem', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '50%' }}>
            <Lock size={48} color="var(--color-primary)" />
          </div>
        </div>
        <h2 className="text-gradient" style={{ marginBottom: '0.5rem' }}>StoryForge 접속</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>마스터 비밀번호를 입력해주세요.</p>
        
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="form-input"
          style={{ marginBottom: '1.5rem', textAlign: 'center' }}
          autoFocus
        />
        
        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }} disabled={loading}>
          {loading ? '확인 중...' : '잠금 해제'}
        </button>
      </form>
    </div>
  );
};

export default Login;
