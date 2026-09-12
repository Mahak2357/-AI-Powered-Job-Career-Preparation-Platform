import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, ChevronDown, Flame, Medal, Trophy, Zap } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useInterview } from "../hooks/useInterview";
import "../style/roadmap.scss";

export default function Roadmap() {
  const navigate = useNavigate();
  const { interviewId } = useParams();
  const { report, loading, toggleRoadmapTask } = useInterview();
  const [openWeeks, setOpenWeeks] = useState(new Set([0]));
  const [pendingTask, setPendingTask] = useState("");
  const [celebration, setCelebration] = useState(null);
  const [taskError, setTaskError] = useState("");

  if (loading || !report || report._id !== interviewId) {
    return <main className="roadmap-loading">Loading your preparation roadmap...</main>;
  }

  const plan = report.preparationPlan || [];
  const progress = report.gamification || { totalTasks: 0, completedTasks: 0, percentage: 0, earnedXp: 0, level: 1, streak: 0, badges: [] };
  const weeks = Array.from({ length: Math.ceil(plan.length / 7) }, (_, index) => plan.slice(index * 7, index * 7 + 7));

  const toggleWeek = (weekIndex) => setOpenWeeks((current) => {
    const next = new Set(current);
    next.has(weekIndex) ? next.delete(weekIndex) : next.add(weekIndex);
    return next;
  });

  const toggleTask = async (dayIndex, taskIndex, task) => {
    const taskKey = `${dayIndex}-${taskIndex}`;
    if (pendingTask) return;
    setTaskError("");
    setPendingTask(taskKey);
    try {
      const updatedReport = await toggleRoadmapTask({ interviewId, dayIndex, taskIndex, completed: !task.completed });
      if (!task.completed) {
        const updatedProgress = updatedReport.gamification;
        setCelebration({ xp: task.xp, message: updatedProgress.completedTasks === updatedProgress.totalTasks ? "Roadmap complete" : "Task completed" });
        window.setTimeout(() => setCelebration(null), 1800);
      }
    } catch (error) {
      setTaskError(error.response?.data?.message || "Task progress could not be saved. Please try again.");
    } finally {
      setPendingTask("");
    }
  };

  return <main className="roadmap-page">
    <div className="roadmap-rays" />
    <header className="roadmap-topbar">
      <button className="roadmap-back" onClick={() => navigate("/dashboard")}><ArrowLeft size={16} /> Workspace</button>
      <button className="roadmap-report-link" onClick={() => navigate(`/interview/${interviewId}`)}>Interview dossier</button>
    </header>

    <section className="roadmap-hero">
      <div><p className="roadmap-kicker">ACTIVE PREPARATION PLAN</p><h1>{report.title || "Your preparation roadmap"}</h1><p>Turn focused practice into visible momentum.</p></div>
      <div className="roadmap-progress-ring" style={{ "--progress": `${progress.percentage * 3.6}deg` }}><strong>{progress.percentage}%</strong><span>complete</span></div>
    </section>

    <section className="roadmap-stat-grid" aria-label="Roadmap progress">
      <article><Check size={18} /><div><small>TASKS COMPLETE</small><strong>{progress.completedTasks}/{progress.totalTasks}</strong></div></article>
      <article><Zap size={18} /><div><small>PREPARATION XP</small><strong>{progress.earnedXp} XP</strong></div></article>
      <article><Trophy size={18} /><div><small>CURRENT LEVEL</small><strong>Level {progress.level}</strong></div></article>
      <article><Flame size={18} /><div><small>DAILY STREAK</small><strong>{progress.streak} days</strong></div></article>
    </section>

    <section className="roadmap-content">
      <div className="roadmap-main">
        {taskError && <p className="roadmap-error">{taskError}</p>}
        <div className="roadmap-heading"><div><p className="roadmap-kicker">WEEKLY EXECUTION</p><h2>Build your interview edge</h2></div><span>{progress.completedWeeks} completed weeks</span></div>
        {weeks.map((week, weekIndex) => {
          const completedCount = week.flatMap((day) => day.tasks || []).filter((task) => task.completed).length;
          const totalCount = week.flatMap((day) => day.tasks || []).length;
          const isCompleted = totalCount > 0 && completedCount === totalCount;
          return <section className={`roadmap-week ${isCompleted ? "roadmap-week--complete" : ""}`} key={weekIndex}>
            <button className="roadmap-week-header" onClick={() => toggleWeek(weekIndex)}><div><span>WEEK {weekIndex + 1}</span><strong>{isCompleted ? "Week complete" : `${completedCount}/${totalCount} tasks complete`}</strong></div><ChevronDown size={18} className={openWeeks.has(weekIndex) ? "is-open" : ""} /></button>
            <AnimatePresence initial={false}>{openWeeks.has(weekIndex) && <motion.div className="roadmap-days" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
              {week.map((day, relativeIndex) => {
                const dayIndex = weekIndex * 7 + relativeIndex;
                const dayCompleted = day.tasks?.length && day.tasks.every((task) => task.completed);
                return <article className={`roadmap-day-card ${dayCompleted ? "roadmap-day-card--complete" : ""}`} key={day.day || dayIndex}>
                  <div className="roadmap-day-title"><span>DAY {day.day}</span><h3>{day.focus}</h3>{dayCompleted && <Check size={17} />}</div>
                  <div className="roadmap-task-list">{(day.tasks || []).map((task, taskIndex) => {
                    const taskKey = `${dayIndex}-${taskIndex}`;
                    return <label className={`roadmap-task ${task.completed ? "roadmap-task--complete" : ""}`} key={taskKey}><input type="checkbox" checked={Boolean(task.completed)} disabled={pendingTask === taskKey} onChange={() => toggleTask(dayIndex, taskIndex, task)} /><span className="task-title">{task.title}</span><span className="task-xp">+{task.xp} XP</span></label>;
                  })}</div>
                  {(day.notes?.length > 0 || day.tips?.length > 0) && <div className="roadmap-notes">{day.notes?.[0] && <p><b>Note</b>{day.notes[0]}</p>}{day.tips?.[0] && <p><b>Tip</b>{day.tips[0]}</p>}</div>}
                </article>;
              })}
            </motion.div>}</AnimatePresence>
          </section>;
        })}
      </div>
      <aside className="roadmap-sidebar"><section><Medal size={19} /><p className="roadmap-kicker">MILESTONES</p><h3>Earned badges</h3>{progress.badges.length ? progress.badges.map((badge) => <div className="roadmap-badge" key={badge.label}><strong>{badge.label}</strong><span>{badge.detail}</span></div>) : <p className="roadmap-muted">Complete your first task to unlock a milestone.</p>}</section><section><p className="roadmap-kicker">NEXT LEVEL</p><h3>{Math.max(0, progress.nextLevelXp - progress.earnedXp)} XP to Level {progress.level + 1}</h3><div className="roadmap-xp-meter"><span style={{ width: `${((progress.earnedXp % 250) / 250) * 100}%` }} /></div></section></aside>
    </section>
    <AnimatePresence>{celebration && <motion.div className="roadmap-toast" initial={{ opacity: 0, y: 15, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }}><Zap size={17} /><span>{celebration.message}</span><strong>+{celebration.xp} XP</strong></motion.div>}</AnimatePresence>
  </main>;
}
