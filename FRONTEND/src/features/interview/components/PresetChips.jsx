import React from 'react';

export default function PresetChips({ presets, onSelectPreset }) {
  return (
    <section id="presets" className="presets-section">
      <div className="presets-header">
        <span>⚡ Quick Test Profiles</span>
        <span>Click to auto-fill form</span>
      </div>
      <div className="preset-row">
        {presets.map((p, i) => (
          <div key={i} className="preset-chip" onClick={() => onSelectPreset(p)}>
            <span>{p.label}</span>
            <span>Load &rarr;</span>
          </div>
        ))}
      </div>
    </section>
  );
}