import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

import Dashboard from './pages/Dashboard';
import Characters from './pages/Characters';
import Worldviews from './pages/Worldviews';
import Generate from './pages/Generate';
import StoryView from './pages/StoryView';

import { ThemeProvider } from './components/Layout';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import { apiClient } from './api/client';

function App() {
  const [theme, setTheme] = useState('dark');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('storyforge_token');
      if (token) {
        try {
          await apiClient.post('/auth', {});
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('storyforge_token');
        }
      }
      setIsCheckingAuth(false);
    };
    verifyAuth();

    apiClient.get('/settings').then(res => {
      setTheme(res.data?.theme || 'dark');
    }).catch(() => {});
  }, []);

  if (isCheckingAuth) return null;

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login onLogin={() => setIsAuthenticated(true)} /> : <Navigate to="/" />} />
          <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
            <Route index element={<Dashboard />} />
            <Route path="books" element={<Books />} />
            <Route path="books/:id" element={<BookDetail />} />
            <Route path="characters" element={<Characters />} />
            <Route path="worldviews" element={<Worldviews />} />
            <Route path="generate" element={<Generate />} />
            <Route path="stories/:id" element={<StoryView />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
