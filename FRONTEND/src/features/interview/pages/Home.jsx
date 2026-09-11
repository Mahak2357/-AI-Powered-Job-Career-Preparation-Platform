import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "../style/home.scss";
import { useInterview } from '../hooks/useInterview.js';

const Home = () => {
  const { loading, generateReport, reports = [] } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  const resumeInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleGenerateReport = async () => {
    setError("");

    if (!jobDescription.trim()) {
      setError("Please provide a Job Description to proceed.");
      return;
    }

    const resumeFile = selectedFile || resumeInputRef.current?.files?.[0];
    if (!resumeFile && !selfDescription.trim()) {
      setError("Please provide either a Resume file OR a Quick Self-Description.");
      return;
    }

    try {
      const data = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });

      if (data && data._id) {
        navigate(`/interview/${data._id}`);
      } else {
        throw new Error("Invalid response received from server.");
      }
    } catch (err) {
      setError(err.message || "Failed to generate interview strategy. Check your inputs and server connection.");
    }
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="pulse-orb"></div>
        <h2>Synthesizing Interview Strategy</h2>
        <p>Gemini AI is analyzing skill matrices, ATS metrics, and behavioral questions...</p>
      </main>
    );
  }

  return (
    <div className="home-page">
      {/* Header */}
      <header className="page-header">
        <span className="badge">AI Career Copilot</span>
        <h1>
          Create Your Custom <span className="highlight-text">Interview Plan</span>
        </h1>
        <p>
          Let our intelligence engine analyze job expectations against your background to build an unbeatable strategy.
        </p>
      </header>

      {error && <div className="error-toast">{error}</div>}

      {/* Main Card */}
      <div className="interview-card glass-panel">
        <div className="interview-card__body">
          {/* Left Panel */}
          <div className="panel panel--left">
            <div className="panel__header">
              <span className="panel__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
              </span>
              <h2>Target Job Description</h2>
              <span className="badge-required">Required</span>
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="panel__textarea"
              placeholder={`Paste the job requirements here...\ne.g., 'Senior Frontend Engineer: React, Next.js, Web Vitals optimization, and micro-frontend architectures...'`}
              maxLength={5000}
            />
            <div className="char-counter">
              {jobDescription.length} / 5000 chars
            </div>
          </div>

          <div className="panel-divider" />

          {/* Right Panel */}
          <div className="panel panel--right">
            <div className="panel__header">
              <span className="panel__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </span>
              <h2>Your Professional Profile</h2>
            </div>

            <div className="upload-section">
              <div className="section-title-wrap">
                <label className="section-label">Upload Resume</label>
                <span className="badge-best">Recommended</span>
              </div>

              <label className={`dropzone ${selectedFile ? 'has-file' : ''}`} htmlFor="resume">
                <span className="dropzone__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                </span>
                <p className="dropzone__title">
                  {selectedFile ? selectedFile.name : 'Click to upload or drag & drop'}
                </p>
                <p className="dropzone__subtitle">
                  {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready` : 'PDF or DOCX (Max 5MB)'}
                </p>
                <input
                  ref={resumeInputRef}
                  onChange={handleFileChange}
                  hidden
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf,.docx"
                />
              </label>
            </div>

            <div className="or-divider"><span>OR</span></div>

            <div className="self-description">
              <label className="section-label" htmlFor="selfDescription">Quick Self-Description</label>
              <textarea
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                id="selfDescription"
                name="selfDescription"
                className="panel__textarea panel__textarea--short"
                placeholder="Briefly describe your experience, primary skills, and project accomplishments..."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="interview-card__footer">
          <span className="footer-info">
            ✦ Powered by Gemini AI • Strategy synthesis takes ~20-30s
          </span>
          <button
            type="button"
            onClick={handleGenerateReport}
            className="generate-btn"
          >
            <span>Generate Custom Plan</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
          </button>
        </div>
      </div>

      {/* Reports Showcase */}
      {reports && reports.length > 0 && (
        <section className="recent-reports">
          <h2>My Previous Strategies</h2>
          <div className="reports-grid">
            {reports.map((report) => (
              <div
                key={report._id}
                className="report-card glass-panel"
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                <div className="report-card__top">
                  <h3>{report.title || 'Target Role Analysis'}</h3>
                  <span className={`match-badge ${report.matchScore >= 75 ? 'high' : report.matchScore >= 50 ? 'mid' : 'low'}`}>
                    {report.matchScore ?? 0}% Match
                  </span>
                </div>
                <p className="report-meta">
                  Generated {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Recently'}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;