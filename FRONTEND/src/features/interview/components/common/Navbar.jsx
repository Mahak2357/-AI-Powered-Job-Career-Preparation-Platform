import React from 'react';
import { useAuth } from '../../../auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ darkMode, setDarkMode, onLaunchWorkspace }) {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="site-header">
      <div className="nav-wrapper">
        <div className="nav-brand" onClick={() => navigate('/')}>
          <div className="brand-icon">✦</div>
          <div className="brand-title">PrepAI<span>.studio</span></div>
        </div>

        <nav className="nav-menu">
          <a href="#features">Features</a>
          <a href="#presets">Presets</a>
          <a href="#workspace">Workspace</a>
          <span className="badge-pill">Gemini 2.5</span>
        </nav>

        <div className="nav-actions">
          <button className="theme-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️' : '🌙'}
          </button>

          {user ? (
            <div className="user-pill">
              <span className="avatar">{user.username?.[0]?.toUpperCase() || 'U'}</span>
              <span>{user.username}</span>
              <button className="exit-btn" onClick={handleLogout}>Exit</button>
            </div>
          ) : (
            <button className="theme-btn" onClick={() => navigate('/login')}>
              Sign In
            </button>
          )}

          <button className="cta-nav" onClick={onLaunchWorkspace}>
            Launch Studio
          </button>
        </div>
      </div>
    </header>
  );
}