import React, { useState } from 'react';

export default function ResultsDashboard({ report }) {
  const [tab, setTab] = useState('radar');
  const [openQ, setOpenQ] = useState(0);

  return (
    <section id="results-dashboard" className="results-section">
      <div className="results-card">
        <div className="results-top">
          <div>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 800 }}>ANALYSIS COMPLETED</span>
            <h3>{report.title}</h3>
          </div>
          <div className="score-display">
            <div className="score-val">{report.matchScore}%</div>
            <div className="score-label">ATS Score</div>
          </div>
        </div>

        <div className="tabs-bar">
          <button className={`tab-btn ${tab === 'radar' ? 'active' : ''}`} onClick={() => setTab('radar')}>
            ATS & Skills
          </button>
          <button className={`tab-btn ${tab === 'scenarios' ? 'active' : ''}`} onClick={() => setTab('scenarios')}>
            STAR Mock Scenarios
          </button>
          <button className={`tab-btn ${tab === 'roadmap' ? 'active' : ''}`} onClick={() => setTab('roadmap')}>
            Roadmap Plan
          </button>
        </div>

        <div className="tab-content">
          {tab === 'radar' && (
            <div className="skills-grid">
              <div>
                <h4 style={{ marginBottom: '16px' }}>Competency Matrix</h4>
                {report.skillsRadar.map((s, i) => (
                  <div key={i} className="skill-item">
                    <div className="skill-meta">
                      <span>{s.label}</span>
                      <span>{s.score}%</span>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${s.score}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <h4 style={{ marginBottom: '16px' }}>Identified Skill Gaps</h4>
                {report.skillGaps.map((g, i) => (
                  <div key={i} className={`gap-chip ${g.severity}`}>
                    <span>{g.skill}</span>
                    <span style={{ textTransform: 'uppercase' }}>{g.severity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'scenarios' && (
            <div>
              {report.technicalQuestions.map((q, i) => (
                <div key={i} className="scenario-card">
                  <div className="scenario-header" onClick={() => setOpenQ(openQ === i ? -1 : i)}>
                    <span>Q{i + 1}: {q.question}</span>
                    <span>{openQ === i ? '▲' : '▼'}</span>
                  </div>
                  {openQ === i && (
                    <div className="scenario-body">
                      <div><strong>Interviewer Objective:</strong> <p>{q.intention}</p></div>
                      <div className="answer-box">
                        <strong>STAR Answer:</strong> {q.answer}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === 'roadmap' && (
            <div className="roadmap-grid">
              {report.roadmap.map((d, i) => (
                <div key={i} className="roadmap-day">
                  <span className="day-badge">Day {d.day}</span>
                  <h4>{d.focus}</h4>
                  <ul>
                    {d.tasks.map((t, idx) => <li key={idx}>{t}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}