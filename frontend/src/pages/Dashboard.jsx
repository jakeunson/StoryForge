import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Globe, FileText, ChevronRight } from 'lucide-react';
import { apiClient } from '../api/client';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({ characters: 0, worldviews: 0, stories: 0 });
  const [recentStories, setRecentStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [charsRes, worldsRes, storiesRes] = await Promise.all([
          apiClient.get('/characters'),
          apiClient.get('/worldviews'),
          apiClient.get('/stories')
        ]);
        
        setStats({
          characters: charsRes.length,
          worldviews: worldsRes.length,
          stories: storiesRes.length
        });
        
        // Just take top 5 stories for recent
        setRecentStories(storiesRes.slice(0, 5));
      } catch (error) {
        console.error(error);
        toast.error('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="page-title">대시보드 불러오는 중...</div>;
  }

  const statCards = [
    { title: '인물', count: stats.characters, icon: <Users size={32} color="var(--color-primary)" />, link: '/characters' },
    { title: '세계관', count: stats.worldviews, icon: <Globe size={32} color="#10b981" />, link: '/worldviews' },
    { title: '생성된 스토리', count: stats.stories, icon: <FileText size={32} color="#f59e0b" />, link: '/generate' },
  ];

  return (
    <div>
      <h2 className="page-title text-gradient">환영합니다, 작가님</h2>
      
      {/* Stats Grid */}
      <div className="grid-3" style={{ marginBottom: '3rem' }}>
        {statCards.map((stat, i) => (
          <Link to={stat.link} key={i} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
                {stat.icon}
              </div>
              <div>
                <p className="form-label" style={{ fontSize: '1rem' }}>{stat.title}</p>
                <h3 style={{ fontSize: '2rem', margin: 0 }}>{stat.count}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.5rem' }}>최근 스토리</h3>
          <Link to="/generate" className="btn btn-secondary">
            새로 만들기
          </Link>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {recentStories.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
              아직 생성된 스토리가 없습니다. 첫 번째 이야기를 만들어보세요!
            </div>
          ) : (
            recentStories.map(story => (
              <Link to={`/stories/${story.id}`} key={story.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="glass-card flex-between" style={{ padding: '1.25rem 1.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{story.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      {new Date(story.created_at).toLocaleDateString()} &middot; {story.genre || '장르 미지정'}
                    </p>
                  </div>
                  <ChevronRight size={20} color="var(--color-text-muted)" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
