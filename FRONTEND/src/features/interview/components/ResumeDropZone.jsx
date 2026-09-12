import React, { useRef, useState } from 'react';

export default function ResumeDropZone({ resumeFile, setResumeFile }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setResumeFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      className="dropzone"
      style={{ borderColor: dragActive ? '#6366f1' : undefined }}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx"
        style={{ display: 'none' }}
        onChange={(e) => e.target.files?.[0] && setResumeFile(e.target.files[0])}
      />
      {resumeFile ? (
        <div className="file-info">
          <span>📄 {resumeFile.name} ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)</span>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setResumeFile(null); }}
            style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
          >
            Remove
          </button>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>☁️</div>
          <div className="dropzone-label">Click to select or drop resume</div>
          <div className="dropzone-sub">PDF or DOCX (Max 5MB)</div>
        </div>
      )}
    </div>
  );
}