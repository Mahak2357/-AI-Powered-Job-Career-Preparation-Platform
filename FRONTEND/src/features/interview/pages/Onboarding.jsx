import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, FileText, LoaderCircle, Moon, Sun, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInterview } from "../hooks/useInterview";
import { useTheme } from "../../../theme.context.jsx";
import "../style/prepai.scss";

const profiles = ["Student", "Recent Graduate", "Software Engineer", "Career Switcher"];
const goals = ["DSA", "Coding Interviews", "System Design", "Behavioral / HR", "Resume & ATS", "Mock Interviews", "Company-specific Preparation"];
const companies = ["Google", "Amazon", "Microsoft", "Stripe", "Other"];
const stages = ["Analyzing your profile...", "Finding skill gaps...", "Building your roadmap...", "Personalizing interview practice..."];

export default function Onboarding() {
  const navigate = useNavigate();
  const { generateReport, loading } = useInterview();
  const { theme, toggleTheme } = useTheme();
  const inputRef = useRef(null);
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState("Student");
  const [resume, setResume] = useState(null);
  const [selectedGoals, setSelectedGoals] = useState(["DSA", "Coding Interviews"]);
  const [target, setTarget] = useState({ role: "Software Engineer Intern", company: "Google", experience: "Student", notes: "" });
  const [error, setError] = useState("");

  const toggleGoal = (goal) => setSelectedGoals((current) => current.includes(goal) ? current.filter((item) => item !== goal) : [...current, goal]);
  const selectResume = (file) => {
    if (!file) return;
    if (!/\.(pdf|docx)$/i.test(file.name)) {
      setError("Please select a PDF or DOCX resume.");
      return;
    }
    setError("");
    setResume(file);
  };

  const generatePlan = async () => {
    setError("");
    try {
      const jobDescription = `${target.role} at ${target.company}. Candidate experience: ${target.experience}. Focus areas: ${selectedGoals.join(", ")}.`;
      const selfDescription = `${profile}. Preparing for ${target.role} at ${target.company}. Goals: ${selectedGoals.join(", ")}. ${target.notes}`;
      const report = await generateReport({ jobDescription, selfDescription, resumeFile: resume });
      if (!report?._id) throw new Error("The preparation plan could not be created.");
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.message || "Could not generate your plan. Check your connection and try again.");
    }
  };

  const next = () => setStep((current) => Math.min(current + 1, 4));
  const previous = () => setStep((current) => Math.max(current - 1, 0));
  const stepLabels = ["Profile", "Resume", "Goals", "Target", "Plan"];

  return (
    <main className="prepai-app">
      <div className="app-noise" />
      <header className="app-topbar"><button className="brand-button" onClick={() => navigate("/")}>✦ <span>PrepAI.studio</span></button><div className="app-topbar-actions"><button className="app-theme-toggle" aria-label="Toggle theme" onClick={toggleTheme}>{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}</button><button className="text-button" onClick={() => navigate("/dashboard")}>Workspace</button></div></header>
      <section className="onboarding-shell">
        <p className="eyebrow">PERSONALIZATION</p><h1>Welcome to PrepAI</h1><p className="lede">Let's personalize your preparation.</p>
        <ol className="progress-track">{stepLabels.map((label, index) => <li key={label} className={index <= step ? "active" : ""}><span>{index < step ? <Check size={14} /> : `0${index + 1}`}</span><b>{label}</b></li>)}</ol>
        <motion.section className="onboarding-panel" layout>
          <AnimatePresence mode="wait">
            {loading ? <motion.div key="loading" className="generation-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><LoaderCircle className="spinner" size={32} /><p className="eyebrow">GEMINI IS WORKING</p><h2>{stages[Math.min(step, stages.length - 1)]}</h2><p>Creating recommendations from the profile and role you provided.</p></motion.div> : <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {step === 0 && <><h2>What best describes you?</h2><p className="panel-copy">We'll adapt your roadmap to your current stage.</p><div className="option-grid">{profiles.map((item) => <button key={item} className={`choice-card ${profile === item ? "selected" : ""}`} onClick={() => setProfile(item)}>{profile === item && <Check size={16} />}{item}</button>)}</div></>}
              {step === 1 && <><h2>Let's understand your experience.</h2><p className="panel-copy">Add a PDF or DOCX to give the analysis more context.</p><button className={`resume-drop ${resume ? "has-file" : ""}`} onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); selectResume(event.dataTransfer.files[0]); }}><input ref={inputRef} type="file" accept=".pdf,.docx" onChange={(event) => selectResume(event.target.files[0])} hidden />{resume ? <><FileText size={28} /><span>{resume.name}</span><small>{(resume.size / 1024 / 1024).toFixed(1)} MB ready</small><i onClick={(event) => { event.stopPropagation(); setResume(null); }}><X size={16} /></i></> : <><Upload size={28} /><strong>Drop your resume here, or browse files</strong><small>PDF or DOCX, up to 5 MB</small></>}</button><button className="skip-button" onClick={next}>Skip for now</button></>}
              {step === 2 && <><h2>What do you want to prepare for?</h2><p className="panel-copy">Choose every area that matters for your next opportunity.</p><div className="goal-grid">{goals.map((goal) => <button key={goal} className={`choice-card ${selectedGoals.includes(goal) ? "selected" : ""}`} onClick={() => toggleGoal(goal)}>{selectedGoals.includes(goal) && <Check size={16} />}{goal}</button>)}</div></>}
              {step === 3 && <><h2>Set your target.</h2><p className="panel-copy">Your target helps make the roadmap specific.</p><div className="form-grid"><label>Target role<input value={target.role} onChange={(event) => setTarget({ ...target, role: event.target.value })} /></label><label>Target company<select value={target.company} onChange={(event) => setTarget({ ...target, company: event.target.value })}>{companies.map((company) => <option key={company}>{company}</option>)}</select></label><label>Experience<select value={target.experience} onChange={(event) => setTarget({ ...target, experience: event.target.value })}><option>Student</option><option>0-1 years</option><option>1-3 years</option><option>3+ years</option></select></label><label className="wide">Anything specific you want help with?<textarea value={target.notes} onChange={(event) => setTarget({ ...target, notes: event.target.value })} placeholder="Topics, timelines, or interview concerns" /></label></div></>}
              {step === 4 && <><h2>Ready to build your plan?</h2><p className="panel-copy">We'll use this information to personalize your first roadmap.</p><div className="review-grid"><div><small>PROFILE</small><b>{profile}</b></div><div><small>RESUME</small><b>{resume ? resume.name : "Not added yet"}</b></div><div><small>GOALS</small><b>{selectedGoals.join(", ") || "None selected"}</b></div><div><small>TARGET</small><b>{target.role} at {target.company}</b></div></div></>}
            </motion.div>}
          </AnimatePresence>
          {error && <p className="form-error">{error}</p>}
          {!loading && <div className="wizard-actions">{step > 0 ? <button className="secondary-action" onClick={previous}><ArrowLeft size={16} /> Back</button> : <span />}{step === 4 ? <button className="primary-action" onClick={generatePlan}>Generate My AI Preparation Plan <span>✦</span></button> : <button className="primary-action" onClick={next}>Continue <ArrowRight size={16} /></button>}</div>}
        </motion.section>
      </section>
    </main>
  );
}
