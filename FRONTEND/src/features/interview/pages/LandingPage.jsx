import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import Home from './Home';
import "../style/landing.scss";

export default function LandingPage() {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const workspaceRef = useRef(null);

  const scrollToWorkspace = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-wrapper">
      {/* ── Glassmorphism Navbar ── */}
      <header className="site-navbar glass-panel">
        <div className="nav-brand">
          <span className="brand-icon">✦</span>
          <span className="brand-name">PrepAI<span className="brand-dot">.studio</span></span>
        </div>

        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#workspace" onClick={(e) => { e.preventDefault(); scrollToWorkspace(); }}>Workspace</a>
        </nav>

        <div className="nav-actions">
          {user ? (
            <div className="user-pill">
              <span className="user-avatar">{user.username?.[0]?.toUpperCase() || 'U'}</span>
              <span className="user-name">{user.username || 'Candidate'}</span>
              <button className="logout-btn" onClick={handleLogout}>Exit</button>
            </div>
          ) : (
            <>
              <button className="nav-btn ghost" onClick={() => navigate('/login')}>Sign In</button>
              <button className="nav-btn glow-cta" onClick={() => navigate('/register')}>Get Started Free</button>
            </>
          )}
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="hero-section">
        <div className="hero-badge">
          <span className="pulse-dot"></span> Powered by Google Gemini 2.5
        </div>
        
        <h1 className="hero-title">
          Crack Your Dream Tech Role <br />
          <span className="gradient-text">With AI-Crafted Precision</span>
        </h1>

        <p className="hero-subtitle">
          Transform any Job Description into ATS score diagnostics, tailored scenario-based mock interviews, 
          and actionable roadmap blueprints in seconds.
        </p>

        <div className="hero-cta-group">
          <button className="cta-primary" onClick={scrollToWorkspace}>
            <span>Launch Studio Workspace</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <a href="#features" className="cta-secondary">Explore Engine Capabilities</a>
        </div>

        {/* Floating Stat Pills */}
        <div className="stats-strip">
          <div className="stat-card">
            <h3>98.4%</h3>
            <p>ATS Match Accuracy</p>
          </div>
          <div className="stat-card">
            <h3>30 sec</h3>
            <p>Average Plan Synthesis</p>
          </div>
          <div className="stat-card">
            <h3>Top 1%</h3>
            <p>Model Answers Generated</p>
          </div>
        </div>
      </section>

      {/* ── Features Showcase ── */}
      <section id="features" className="features-grid-section">
        <div className="section-heading">
          <span className="tag">Architected For Impact</span>
          <h2>Everything You Need To Secure The Offer</h2>
        </div>

        <div className="features-container">
          <div className="feature-box glass-panel">
            <div className="feature-icon">🎯</div>
            <h3>Skill Gap Radar</h3>
            <p>Extracts latent requirements from descriptions and pinpoints your technical and soft-skill deficiencies.</p>
          </div>
          <div className="feature-box glass-panel">
            <div className="feature-icon">🧠</div>
            <h3>Scenario Mock Engine</h3>
            <p>Produces interviewer intentions and high-impact STAR-method model responses for hard-hitting questions.</p>
          </div>
          <div className="feature-box glass-panel">
            <div className="feature-icon">📄</div>
            <h3>Tailored ATS PDF</h3>
            <p>Generates an optimized resume formatted explicitly for applicant tracking filters via Puppeteer.</p>
          </div>
        </div>
      </section>

      {/* ── Actual Workspace / Home Module ── */}
      <section id="workspace" ref={workspaceRef} className="workspace-embed-section">
        <Home />
      </section>

      {/* ── High-End Footer ── */}
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="nav-brand">
              <span className="brand-icon">✦</span>
              <span className="brand-name">PrepAI<span className="brand-dot">.studio</span></span>
            </div>
            <p>Next-generation career strategy and technical interview acceleration platform.</p>
          </div>

          <div className="footer-links-group">
            <div>
              <h4>Platform</h4>
              <a href="#workspace">Workspace</a>
              <a href="#features">Features</a>
            </div>
            <div>
              <h4>Stack</h4>
              <span>React 18</span>
              <span>Gemini AI</span>
              <span>Express & JWT</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 PrepAI Studio. All rights reserved.</p>
          <div className="footer-meta">Production Build Ready</div>
        </div>
      </footer>
    </div>
  );
}