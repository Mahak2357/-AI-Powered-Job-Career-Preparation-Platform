import React from 'react';

export default function GenerationStepper({ step }) {
  return (
    <div className="stepper-box">
      <div className="stepper-header">
        <span>Active Neural Pipeline</span>
        <span>Step {step} of 3</span>
      </div>
      <div className="progress-bar-bg">
        <div className="progress-bar-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
      </div>
      <div className={`step-text ${step >= 1 ? 'active' : ''}`}>
        1. Parsing Job Description and Candidate Profile Payload...
      </div>
      <div className={`step-text ${step >= 2 ? 'active' : ''}`}>
        2. Running ATS Keyword Differential and Deficiency Matrix...
      </div>
      <div className={`step-text ${step >= 3 ? 'active' : ''}`}>
        3. Synthesizing STAR Scenarios and Preparation Schedule...
      </div>
    </div>
  );
}