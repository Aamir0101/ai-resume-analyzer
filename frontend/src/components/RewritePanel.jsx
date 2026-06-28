import React, { useState } from 'react';
import { Download, Copy, Check, Wand2 } from 'lucide-react';

export default function RewritePanel({ rewrittenResume, resumeId, onRewrite, loading }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(rewrittenResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    window.open(`/api/analysis/download/${resumeId}`, '_blank');
  };

  if (!rewrittenResume) {
    return (
      <div className="card animate-in" style={{ textAlign: 'center', padding: '48px 32px' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <Wand2 size={24} color="var(--accent-purple)" />
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 10 }}>
          AI-Powered Resume Rewrite
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 400, margin: '0 auto 24px', lineHeight: 1.7 }}>
          Generate an improved version of your resume that addresses all identified weaknesses, adds stronger action verbs, and optimizes for ATS systems.
        </p>
        <button
          className="btn btn-primary btn-lg"
          onClick={onRewrite}
          disabled={loading}
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
        >
          {loading ? (
            <><div className="spinner" style={{ borderTopColor: 'white' }} /> Rewriting your resume...</>
          ) : (
            <><Wand2 size={16} /> Rewrite My Resume</>
          )}
        </button>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 14 }}>
          This may take 15–30 seconds
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 4 }}>
            ✨ Improved Resume
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            AI-rewritten version addressing all identified issues
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={handleCopy}>
            {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
          </button>
          <button className="btn btn-primary" onClick={handleDownload}>
            <Download size={14} /> Download .txt
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '10px 16px',
          background: 'rgba(139, 92, 246, 0.05)',
          borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-purple)' }} />
          <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)' }}>
            improved_resume.txt
          </span>
        </div>
        <pre style={{
          padding: '20px 24px',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          lineHeight: 1.8,
          color: 'var(--text-secondary)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          maxHeight: '500px',
          overflowY: 'auto',
          margin: 0
        }}>
          {rewrittenResume}
        </pre>
      </div>
    </div>
  );
}
