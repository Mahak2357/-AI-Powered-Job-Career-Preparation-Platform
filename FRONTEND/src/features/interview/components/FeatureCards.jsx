import React from 'react';

export default function FeatureCards() {
  return (
    <section id="features" className="features-section">
      <div className="section-tag">Architected For Impact</div>
      <h2 className="section-title">Engineered Beyond Generic Prompts</h2>

      <div className="cards-grid">
        <div className="feature-card">
          <div className="card-icon">🎯</div>
          <h3>Skill Gap Radar</h3>
          <p>Extracts tacit architectural criteria from specifications to pinpoint your critical knowledge voids.</p>
        </div>
        <div className="feature-card">
          <div className="card-icon">🧠</div>
          <h3>Scenario Mock Engine</h3>
          <p>Synthesizes interviewer mental models and STAR model responses for complex technical situations.</p>
        </div>
        <div className="feature-card">
          <div className="card-icon">📊</div>
          <h3>Tailored ATS Engine</h3>
          <p>Produces calibrated keyword alignment scores and compiles optimized candidate profiles.</p>
        </div>
      </div>
    </section>
  );
}