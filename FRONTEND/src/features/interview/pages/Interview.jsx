import { useState, useEffect } from 'react';
import { Check, Copy, Play } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import '../style/interview.scss';
import { useInterview } from '../hooks/useInterview.js';

const NAV_ITEMS = [
  { 
    id: 'technical', 
    label: 'Technical Questions', 
    icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) 
  },
  { 
    id: 'behavioral', 
    label: 'Behavioral Questions', 
    icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) 
  },
  { 
    id: 'roadmap', 
    label: 'Road Map', 
    icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) 
  },
];

// Sub-components
const QuestionCard = ({ item, index, onPractice }) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAnswer = async () => {
    try {
      await navigator.clipboard.writeText(`${item?.question || ''}\n\n${item?.answer || ''}`.trim());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className={`q-card ${open ? 'q-card--expanded' : ''}`}>
      <div className="q-card__header" onClick={() => setOpen(prev => !prev)}>
        <span className="q-card__index">Q{index + 1}</span>
        <p className="q-card__question">{item?.question || 'Question detail unavailable'}</p>
        <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
        </span>
      </div>
      {open && (
        <div className="q-card__body">
          {item?.intention && (
            <div className="q-card__section">
              <span className="q-card__tag q-card__tag--intention">Interviewer's Objective</span>
              <p>{item.intention}</p>
            </div>
          )}
          {item?.answer && (
            <div className="q-card__section">
              <span className="q-card__tag q-card__tag--answer">Strategic Model Answer</span>
              <p>{item.answer}</p>
              <div className="q-card__actions"><button type="button" onClick={copyAnswer}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copied' : 'Copy answer'}</button>{onPractice && <button type="button" onClick={onPractice}><Play size={14} /> Practice this</button>}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const RoadMapDay = ({ day }) => (
  <div className="roadmap-day glass-panel">
    <div className="roadmap-day__header">
      <span className="roadmap-day__badge">Day {day?.day ?? '-'}</span>
      <h3 className="roadmap-day__focus">{day?.focus || 'Core Preparation Focus'}</h3>
    </div>
    <ul className="roadmap-day__tasks">
      {(day?.tasks || []).map((task, i) => (
        <li key={i}>
          <span className="roadmap-day__bullet" />
          <span>{typeof task === "string" ? task : task.title}</span>
        </li>
      ))}
    </ul>
    {(day?.notes?.length > 0 || day?.tips?.length > 0) && (
      <div className="roadmap-day__guidance">
        {day.notes?.length > 0 && <div><strong>Notes</strong><p>{day.notes.join(" ")}</p></div>}
        {day.tips?.length > 0 && <div><strong>Interview tips</strong><p>{day.tips.join(" ")}</p></div>}
      </div>
    )}
  </div>
);

// Main Component
const Interview = () => {
  const [activeNav, setActiveNav] = useState('technical');
  const [downloading, setDownloading] = useState(false);
  const { report, getReportById, loading, getResumePdf } = useInterview();
  const { interviewId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId, getReportById]);

  const handleDownload = async () => {
    if (!interviewId) return;
    setDownloading(true);
    try {
      await getResumePdf(interviewId);
    } catch {
      alert("PDF download failed. Backend Puppeteer service may be initializing.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading || !report) {
    return (
      <main className="loading-screen">
        <div className="pulse-orb"></div>
        <h2>Loading your interview dossier...</h2>
        <p>Gathering questions, scorecards, and strategy blueprints.</p>
      </main>
    );
  }

  const technicalQuestions = report.technicalQuestions || [];
  const behavioralQuestions = report.behavioralQuestions || [];
  const preparationPlan = report.preparationPlan || [];
  const skillGaps = report.skillGaps || [];
  const matchScore = report.matchScore ?? 0;

  const scoreColor =
    matchScore >= 80 ? 'score--high' :
    matchScore >= 60 ? 'score--mid' : 'score--low';

  return (
    <div className="interview-page">
      <div className="interview-topbar">
        <button className="back-btn" onClick={() => navigate('/')}>
          &larr; Back to Dashboard
        </button>
        <span className="role-tag">{report.title || 'Target Role Analysis'}</span>
      </div>

      <div className="interview-layout">
        {/* Left Navigation */}
        <nav className="interview-nav glass-panel">
          <div className="nav-content">
            <p className="interview-nav__label">Dossier Sections</p>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                onClick={() => setActiveNav(item.id)}
              >
                <span className="interview-nav__icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="button primary-button download-btn"
          >
            {downloading ? (
              <span className="btn-loader"></span>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2v14m0 0l-5-5m5 5l5-5M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
                <span>Download Resume</span>
              </>
            )}
          </button>
        </nav>

        {/* Center Content */}
        <main className="interview-content glass-panel">
          {activeNav === 'technical' && (
            <section className="fade-section">
              <div className="content-header">
                <h2>Technical Evaluation</h2>
                <span className="content-header__count">{technicalQuestions.length} Questions</span>
              </div>
              <div className="q-list">
                {technicalQuestions.length > 0 ? (
                  technicalQuestions.map((q, i) => (
                    <QuestionCard key={i} item={q} index={i} onPractice={() => navigate(`/roadmap/${interviewId}`)} />
                  ))
                ) : (
                  <p className="empty-notice">No technical questions synthesized for this plan.</p>
                )}
              </div>
            </section>
          )}

          {activeNav === 'behavioral' && (
            <section className="fade-section">
              <div className="content-header">
                <h2>Behavioral & Leadership Scenarios</h2>
                <span className="content-header__count">{behavioralQuestions.length} Questions</span>
              </div>
              <div className="q-list">
                {behavioralQuestions.length > 0 ? (
                  behavioralQuestions.map((q, i) => (
                    <QuestionCard key={i} item={q} index={i} onPractice={() => navigate(`/roadmap/${interviewId}`)} />
                  ))
                ) : (
                  <p className="empty-notice">No behavioral scenarios synthesized for this plan.</p>
                )}
              </div>
            </section>
          )}

          {activeNav === 'roadmap' && (
            <section className="fade-section">
              <div className="content-header">
                <h2>Execution Roadmap</h2>
                <button className="open-roadmap-link" onClick={() => navigate(`/roadmap/${interviewId}`)}>Open interactive roadmap</button>
              </div>
              <div className="roadmap-list">
                {preparationPlan.length > 0 ? (
                  preparationPlan.map((day, i) => (
                    <RoadMapDay key={day.day || i} day={day} />
                  ))
                ) : (
                  <p className="empty-notice">No preparation schedule synthesized for this plan.</p>
                )}
              </div>
            </section>
          )}
        </main>

        {/* Right Sidebar */}
        <aside className="interview-sidebar glass-panel">
          <div className="match-score">
            <p className="match-score__label">ATS Match Index</p>
            <div className={`match-score__ring ${scoreColor}`}>
              <span className="match-score__value">{matchScore}</span>
              <span className="match-score__pct">%</span>
            </div>
            <p className="match-score__sub">
              {matchScore >= 80 ? 'Exceptional Fit' : matchScore >= 60 ? 'Competitive Fit' : 'Skill Gap Identified'}
            </p>
          </div>

          <div className="sidebar-divider" />

          <div className="skill-gaps">
            <p className="skill-gaps__label">Identified Skill Gaps</p>
            <div className="skill-gaps__list">
              {skillGaps.length > 0 ? (
                skillGaps.map((gap, i) => {
                  const skillName = typeof gap === 'string' ? gap : gap.skill;
                  const severity = gap?.severity || 'medium';
                  return (
                    <span key={i} className={`skill-tag skill-tag--${severity}`}>
                      {skillName}
                    </span>
                  );
                })
              ) : (
                <p className="no-gaps">No critical gaps identified!</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Interview;