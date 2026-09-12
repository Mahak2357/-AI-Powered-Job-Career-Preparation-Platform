import React from 'react';

export default function HeroSection({ onLaunchWorkspace }) {
  return (
    <section className="hero-section">
        <div className="hero-atmosphere" aria-hidden="true">
        <div className="radial-grid-mask" />
        <div className="cinematic-ray ray-1" />
        <div className="cinematic-ray ray-2" />
        <div className="cinematic-ray ray-3" />
        <div className="luminous-orb orb-primary" />
        <div className="luminous-orb orb-secondary" />
        <span className="star-mote mote-1" />
        <span className="star-mote mote-2" />
      </div>
      <div className="hero-tag">✦ Powered by Google Gemini 2.5</div>
      <h1 className="hero-title">
        Crack Your Dream Tech Role <br />
        <span className="gradient-span">With AI-Crafted Precision</span>
      </h1>
      <p className="hero-subtitle">
        Transform arbitrary Job Descriptions and Raw Resumes into diagnostic ATS matrices,
        STAR-method interview simulations, and targeted blueprints.
      </p>

      <div className="hero-cta-group">
        <button className="btn-primary" onClick={onLaunchWorkspace}>
          Open Interactive Workspace &rarr;
        </button>
        <a href="#features" className="btn-secondary">
          Explore Capabilities
        </a>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-val">98.4%</div>
          <div className="stat-label">ATS Accuracy</div>
        </div>
        <div className="stat-box">
          <div className="stat-val">&lt; 3.5s</div>
          <div className="stat-label">Synthesis Speed</div>
        </div>
        <div className="stat-box">
          <div className="stat-val">10k+</div>
          <div className="stat-label">STAR Scenarios</div>
        </div>
        <div className="stat-box">
          <div className="stat-val">Top 1%</div>
          <div className="stat-label">Model Depth</div>
        </div>
      </div>
    </section>
  );
}