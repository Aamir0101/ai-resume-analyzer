import React, { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, Zap, AlertTriangle, Key, TrendingUp } from 'lucide-react';
import ScoreRing from './ScoreRing.jsx';
import SectionScores from './SectionScores.jsx';

export default function AnalysisPanel({ analysis, hasJD }) {
  const [tab, setTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'skills', label: 'Skills & Keywords' },
    { id: 'suggestions', label: 'Improvements' },
  ];

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ATS Score header */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
        <ScoreRing score={analysis.atsScore} size={140} label="ATS Score" />
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 8, textTransform: 'uppercase' }}>
            Overall Assessment
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
            {analysis.overallFeedback}
          </p>
          {!hasJD && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginTop: 14,
              padding: '8px 12px', background: 'rgba(245, 158, 11, 0.06)',
              border: '1px solid rgba(245, 158, 11, 0.15)', borderRadius: 8
            }}>
              <AlertTriangle size={14} color="var(--accent-yellow)" />
              <span style={{ fontSize: 12, color: 'var(--accent-yellow)' }}>
                Add a job description to see skill gap analysis and keyword matching
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Strengths */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <CheckCircle size={16} color="var(--accent-green)" />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15 }}>Strengths</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {analysis.strengths?.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-green)', marginTop: 6, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <XCircle size={16} color="var(--accent-red)" />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15 }}>Weaknesses</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {analysis.weaknesses?.map((w, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-red)', marginTop: 6, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{w}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section scores full width */}
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <TrendingUp size={16} color="var(--electric)" />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15 }}>Section Breakdown</span>
            </div>
            <SectionScores sectionScores={analysis.sectionScores} />
          </div>
        </div>
      )}

      {tab === 'skills' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Skills found */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Zap size={16} color="var(--accent-green)" />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15 }}>Skills Detected</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {analysis.skillsFound?.map((s, i) => (
                <span key={i} className="tag tag-green">{s}</span>
              ))}
            </div>
          </div>

          {/* Skill gaps */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <AlertTriangle size={16} color="var(--accent-yellow)" />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15 }}>Skill Gaps {hasJD ? '(vs JD)' : ''}</span>
            </div>
            {hasJD ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {analysis.skillsGap?.map((s, i) => (
                  <span key={i} className="tag tag-red">{s}</span>
                ))}
                {!analysis.skillsGap?.length && (
                  <span style={{ fontSize: 13, color: 'var(--accent-green)' }}>✓ No major skill gaps found!</span>
                )}
              </div>
            ) : (
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Add a job description above to see missing skills.</p>
            )}
          </div>

          {/* Keywords found */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Key size={16} color="var(--electric)" />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15 }}>ATS Keywords Found</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {analysis.keywordsFound?.map((k, i) => (
                <span key={i} className="tag tag-blue">{k}</span>
              ))}
            </div>
          </div>

          {/* Keywords missing */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Key size={16} color="var(--accent-red)" />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15 }}>Keywords Missing {hasJD ? '(from JD)' : ''}</span>
            </div>
            {hasJD ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {analysis.keywordsMissing?.map((k, i) => (
                  <span key={i} className="tag tag-purple">{k}</span>
                ))}
                {!analysis.keywordsMissing?.length && (
                  <span style={{ fontSize: 13, color: 'var(--accent-green)' }}>✓ All key terms present!</span>
                )}
              </div>
            ) : (
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Add a job description above to see missing keywords.</p>
            )}
          </div>
        </div>
      )}

      {tab === 'suggestions' && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Lightbulb size={16} color="var(--accent-yellow)" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15 }}>Suggested Improvements</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {analysis.suggestions?.map((s, i) => (
              <div key={i} style={{
                display: 'flex', gap: 14, padding: '14px 16px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                alignItems: 'flex-start'
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 6, flexShrink: 0,
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--accent-yellow)'
                }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
