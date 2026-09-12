import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, CheckCircle2, FileSearch, Flame, Play, Sparkles, Target, Trophy, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { useInterview } from "../hooks/useInterview";
import "../style/prepai.scss";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getReports } = useInterview();
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getReports().then((items) => setReports(Array.isArray(items) ? items : [])).catch(() => setError("Your past plans could not be loaded right now."));
  }, []);

  const currentPlan = reports[0];
  const progress = currentPlan?.gamification || { totalTasks: 0, completedTasks: 0, percentage: 0, earnedXp: 0, level: 1, streak: 0 };
  const planDays = currentPlan?.preparationPlan || [];
  const nextDay = planDays.find((day) => day.tasks?.some((task) => !task.completed));
  const firstName = user?.username || "there";
  const target = currentPlan?.jobDescription?.split(".")[0] || "Your next interview";

  return <main className="prepai-app dashboard-page"><div className="app-noise" />
    <header className="app-topbar"><button className="brand-button" onClick={() => navigate("/")}>✦ <span>PrepAI.studio</span></button><button className="text-button" onClick={() => navigate("/onboarding")}>New plan</button></header>
    <section className="dashboard-shell"><p className="eyebrow">YOUR WORKSPACE</p><h1>Good afternoon, {firstName}.</h1><p className="lede">A focused practice path for your next interview.</p>
      <div className="target-banner"><Target size={19} /><span>{target}</span><button onClick={() => navigate("/onboarding")}>New target</button></div>
      {error && <p className="form-error">{error}</p>}
      {currentPlan ? <><div className="dashboard-progress-stats"><span><CheckCircle2 size={16} /> {progress.completedTasks}/{progress.totalTasks} tasks completed</span><span><Zap size={16} /> {progress.earnedXp} XP</span><span><Flame size={16} /> {progress.streak} day streak</span><span><Trophy size={16} /> Level {progress.level}</span></div>
        <div className="dashboard-grid"><motion.section className="roadmap-panel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}><div className="panel-heading"><div><p className="eyebrow">PERSONALIZED PATH</p><h2>Your Preparation Roadmap</h2><p className="roadmap-summary">{progress.completedTasks}/{progress.totalTasks} tasks completed - {progress.percentage}%</p></div><span className="score-ring" style={{ "--completion": `${progress.percentage}%` }}><b>{progress.percentage}%</b></span></div><div className="roadmap-list">{planDays.slice(0, 4).map((day, index) => { const done = day.tasks?.filter((task) => task.completed).length || 0; const total = day.tasks?.length || 0; return <div key={day.day || index} className={`roadmap-item ${done === total && total ? "completed" : index === 0 ? "current" : ""}`}><span>DAY {day.day}</span><b>{day.focus}</b><small>{done}/{total}</small>{done === total && total ? <CheckCircle2 size={17} /> : <button onClick={() => navigate(`/roadmap/${currentPlan._id}`)}><Play size={14} /> Start</button>}</div>; })}</div><button className="secondary-action full" onClick={() => navigate(`/roadmap/${currentPlan._id}`)}>View Full Roadmap <ArrowRight size={16} /></button></motion.section>
          <aside className="insights-panel"><section><FileSearch size={19} /><p>PREPARATION PROGRESS</p><h3>{progress.percentage}% complete</h3><span>{progress.completedTasks} of {progress.totalTasks} focused tasks are done.</span></section><section><Sparkles size={19} /><p>SKILL GAP</p><h3>{currentPlan.skillGaps?.[0]?.skill || "Building your profile"}</h3><span>Use the daily plan to turn gaps into interview confidence.</span></section><section><Calendar size={19} /><p>UP NEXT</p><h3>{nextDay?.focus || "Roadmap complete"}</h3><button className="text-button" onClick={() => navigate(`/roadmap/${currentPlan._id}`)}>Open practice <ArrowRight size={14} /></button></section></aside></div></> : <section className="past-plans empty-dashboard"><Sparkles size={22} /><h2>Your preparation plan starts here.</h2><p>Create a personalized roadmap to track tasks, XP, streaks, and milestones.</p><button className="primary-action" onClick={() => navigate("/onboarding")}>Create my plan <ArrowRight size={16} /></button></section>}
      {reports.length > 1 && <section className="past-plans"><h2>Previous plans</h2>{reports.slice(1).map((plan) => <button key={plan._id} onClick={() => navigate(`/roadmap/${plan._id}`)}><span>{plan.title}</span><small>{plan.gamification?.completedTasks || 0}/{plan.gamification?.totalTasks || 0} tasks complete</small><ArrowRight size={16} /></button>)}</section>}
    </section>
  </main>;
}
