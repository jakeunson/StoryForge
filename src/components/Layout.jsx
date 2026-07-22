import React, { createContext, useContext, useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { BookOpen, Users, Globe, PenTool, LayoutDashboard, Settings as SettingsIcon, Library } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { apiClient } from '../api/client';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Load theme from backend settings on mount
    apiClient.get('/settings').then(data => {
      if (data && data.theme) {
        setTheme(data.theme);
        document.documentElement.setAttribute('data-theme', data.theme);
      }
    }).catch(err => console.error("Could not load theme", err));
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    try {
      await apiClient.put('/settings', { theme: newTheme });
    } catch (e) {
      console.error("Could not save theme", e);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const Layout = () => {
  const { theme } = useContext(ThemeContext);
  
  const navItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: '대시보드' },
    { path: '/books', icon: <Library size={20} />, label: '내 서재' },
    { path: '/characters', icon: <Users size={20} />, label: '인물 관리' },
    { path: '/worldviews', icon: <Globe size={20} />, label: '세계관 관리' },
    { path: '/generate', icon: <PenTool size={20} />, label: '스토리 생성' },
    { path: '/settings', icon: <SettingsIcon size={20} />, label: '설정' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        borderRight: '1px solid var(--color-border)',
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-bg-base)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 1rem', marginBottom: '3rem' }}>
          <div style={{ background: 'var(--color-primary)', padding: '6px', borderRadius: '8px' }}>
            <BookOpen size={24} color="white" />
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }} className="text-gradient">StoryForge</h1>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                textDecoration: 'none',
                color: isActive ? (theme === 'light' ? 'white' : 'white') : 'var(--color-text-muted)',
                background: isActive ? 'var(--color-primary)' : 'transparent',
                fontWeight: isActive ? 500 : 400,
                transition: 'all 0.2s'
              })}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto' }}>
        <Outlet />
      </main>

      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: 'var(--color-bg-card)',
          color: 'var(--color-text-main)',
          border: '1px solid var(--color-border)',
        },
      }}/>
    </div>
  );
};

export default Layout;
