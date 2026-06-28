import React from 'react';

function getBarColor(score) {
  if (score >= 75) return 'var(--accent-green)';
  if (score >= 50) return 'var(--accent-yellow)';
  return 'var(--accent-red)';
}

export default function SectionScores({ sectionScores }) {
  const sections = [
    { key: 'contact', label: 'Contact Info' },
    { key: 'summary', label: 'Summary / Objective' },
    { key: 'experience', label: 'Work Experience' },
    { key: 'education', label: 'Education' },
    { key: 'skills', label: 'Skills' },
    { key: 'formatting', label: 'Formatting & ATS' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {sections.map(({ key, label }) => {
        const score = sectionScores?.[key] ?? 0;
        const color = getBarColor(score);
        return (
          <div key={key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color, fontFamily: 'var(--font-mono)' }}>{score}</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${score}%`, background: color, boxShadow: `0 0 8px ${color}40` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
