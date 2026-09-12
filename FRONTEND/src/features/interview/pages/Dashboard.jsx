import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, CheckCircle2, FileSearch, Play, Sparkles, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { useInterview } from "../hooks/useInterview";
import "../style/prepai.scss";

const roadmap = ["DSA Foundations", "Arrays + Strings", "Trees + Graphs", "Mock Interviews"];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getReports } = useInterview();
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getReports().then((items) => setReports(Array.isArray(items) ? items : [])).catch(() => setError("Your past plans could not be loaded right now."));
  }, []);

  const firstName = user?.username || "there";
  const currentPlan = reports[0];
  return <main className="prepai-app dashboard-page"><div className="app-noise" /><header className="app-topbar"><button className="brand-button" onClick={() => navigate("/")}>✦ <span>PrepAI.studio</span></button><button className="text-button" onClick={() => navigate("/onboarding")}>New plan</button></header><section className="dashboard-shell"><p className="eyebrow">YOUR WORKSPACE</p><h1>Good afternoon, {firstName}.</h1><p className="lede">A focused practice path for your next interview.</p><div className="target-banner"><Target size={19} /><span>Software Engineer Intern</span><b>@ Google</b><button onClick={() => navigate("/onboarding")}>Edit target</button></div><div className="dashboard-grid"><motion.section className="roadmap-panel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}><div className="panel-heading"><div><p className="eyebrow">PERSONALIZED PATH</p><h2>Your Preparation Roadmap</h2></div><span className="score-ring">78%</span></div><div className="roadmap-list">{roadmap.map((topic, index) => <div key={topic} className={index === 0 ? "roadmap-item current" : "roadmap-item"}><span>WEEK {index + 1}</span><b>{topic}</b>{index === 0 ? <button><Play size={14} /> Start</button> : <CheckCircle2 size={17} />}</div>)}</div><button className="secondary-action full" onClick={() => currentPlan && navigate(`/interview/${currentPlan._id}`)}>View Full Roadmap <ArrowRight size={16} /></button></motion.section><aside className="insights-panel"><section><FileSearch size={19} /><p>RESUME INSIGHTS</p><h3>Strong product thinking</h3><span>Add measurable project outcomes to improve ATS alignment.</span></section><section><Sparkles size={19} /><p>SKILL GAP</p><h3>System design depth</h3><span>Prioritize caching, queues, and trade-off practice.</span></section><section><Calendar size={19} /><p>UP NEXT</p><h3>Arrays practice</h3><button className="text-button">Start Practice <ArrowRight size={14} /></button></section></aside></div><section className="past-plans"><div className="panel-heading"><div><p className="eyebrow">HISTORY</p><h2>Your AI Plans</h2></div></div>{error && <p className="form-error">{error}</p>}{reports.length ? <div className="report-list">{reports.map((report) => <button key={report._id} onClick={() => navigate(`/interview/${report._id}`)}><span>{report.title || "Interview preparation plan"}</span><small>{report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "Recently created"}</small><ArrowRight size={16} /></button>)}</div> : !error && <div className="empty-state">No plan yet. Create your first personalized preparation roadmap.</div>}</section></section></main>;
}
