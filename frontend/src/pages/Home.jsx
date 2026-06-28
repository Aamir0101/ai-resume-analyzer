import React, { useState } from 'react';
import {
  FileSearch, Sparkles, BarChart3, RefreshCw,
  ChevronRight, ArrowRight, Brain
} from 'lucide-react';
import UploadZone from '../components/UploadZone.jsx';
import AnalysisPanel from '../components/AnalysisPanel.jsx';
import RewritePanel from '../components/RewritePanel.jsx';
import { uploadResumePDF, analyzeResume, rewriteResume } from '../utils/api.js';

const STEPS = ['upload', 'analyze', 'results', 'rewrite'];

export default function Home() {
  const [step, setStep] = useState('upload');
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [resumeData, setResumeData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [rewrittenResume, setRewrittenResume] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const handleUploadAndAnalyze = async () => {
    if (!file) return;
    setError('');
    setLoading(true);

    try {
      // Step 1: Upload PDF
      setStatusMsg('Extracting text from PDF...');
      const uploaded = await uploadResumePDF(file);
      setResumeData(uploaded);

      // Step 2: Analyze
      setStatusMsg('Running AI analysis...');
      const result = await analyzeResume(uploaded.resumeId, jobDescription);
      setAnalysis(result.analysis);
      setStep('results');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setStatusMsg('');
    }
  };

  const handleRewrite = async () => {
    if (!resumeData) return;
    setError('');
    setLoading(true);
    try {
      setStatusMsg('Rewriting resume with AI...');
      const result = await rewriteResume(resumeData.resumeId);
      setRewrittenResume(result.rewrittenResume);
      setStep('rewrite');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Rewrite failed. Please try again.');
    } finally {
      setLoading(false);
      setStatusMsg('');
    }
  };

  const handleReset = () => {
    setStep('upload');
    setFile(null);
    setJobDescription('');
    setResumeData(null);
    setAnalysis(null);
    setRewrittenResume('');
    setError('');
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: 900 }}>

        {/* Hero */}
        {step === 'upload' && (
          <div style={{ textAlign: 'center', marginBottom: 48 }} className="animate-in">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 14px', borderRadius: 100,
              background: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.15)',
              marginBottom: 20
            }}>
              <Brain size={13} color="var(--electric)" />
              <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--electric-bright)' }}>
                Powered by Gemini AI
              </span>
            </div>
            <h1 style={{ fontSize: 48, fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 16, lineHeight: 1.1 }}>
              Analyse your resume<br />
              <span style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                beat the ATS
              </span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 17, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              Upload your PDF resume and get an instant ATS score, skill gap analysis, and an AI-rewritten version ready to send.
            </p>

            {/* Feature pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 28 }}>
              {['ATS Scoring', 'Skill Gap Analysis', 'JD Matching', 'AI Rewrite', 'Download Ready'].map(f => (
                <span key={f} className="badge badge-blue" style={{ padding: '6px 14px', fontSize: 12 }}>
                  ✦ {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Progress indicator */}
        {step !== 'upload' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
            {[
              { id: 'upload', label: 'Upload' },
              { id: 'results', label: 'Analysis' },
              { id: 'rewrite', label: 'Rewrite' }
            ].map((s, i, arr) => (
              <React.Fragment key={s.id}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  opacity: (s.id === 'results' && (step === 'results' || step === 'rewrite')) ||
                    (s.id === 'rewrite' && step === 'rewrite') ||
                    s.id === 'upload' ? 1 : 0.3
                }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: step === s.id ? 'var(--electric)' : 'var(--bg-card)',
                    border: `1px solid ${step === s.id ? 'var(--electric)' : 'var(--border-light)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontFamily: 'var(--font-mono)', color: step === s.id ? 'white' : 'var(--text-muted)'
                  }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 500, color: step === s.id ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {s.label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <ChevronRight size={14} color="var(--text-muted)" />
                )}
              </React.Fragment>
            ))}

            <button className="btn btn-ghost" onClick={handleReset} style={{ marginLeft: 'auto', fontSize: 13 }}>
              <RefreshCw size={13} /> Start Over
            </button>
          </div>
        )}

        {/* Upload step */}
        {step === 'upload' && (
          <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <UploadZone file={file} onFile={setFile} onClear={() => setFile(null)} />

            {/* Job description */}
            <div className="card">
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FileSearch size={14} color="var(--electric)" />
                  Job Description
                  <span className="badge badge-blue" style={{ fontSize: 10 }}>Optional</span>
                </label>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  Paste the job posting to get keyword matching and skill gap analysis
                </p>
              </div>
              <textarea
                className="textarea"
                rows={5}
                placeholder="Paste job description here for targeted analysis and keyword matching..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            {error && (
              <div style={{
                padding: '12px 16px',
                background: 'rgba(239, 68, 68, 0.06)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: 8,
                color: 'var(--accent-red)',
                fontSize: 14
              }}>
                {error}
              </div>
            )}

            <button
              className="btn btn-primary btn-lg"
              onClick={handleUploadAndAnalyze}
              disabled={!file || loading}
              style={{ alignSelf: 'flex-start' }}
            >
              {loading ? (
                <><div className="spinner" style={{ borderTopColor: 'white' }} /> {statusMsg || 'Analysing...'}</>
              ) : (
                <><Sparkles size={16} /> Analyse Resume <ArrowRight size={15} /></>
              )}
            </button>
          </div>
        )}

        {/* Results step */}
        {step === 'results' && analysis && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <AnalysisPanel analysis={analysis} hasJD={!!jobDescription} />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => setStep('rewrite')}
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
              >
                <Sparkles size={16} /> Rewrite My Resume <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Rewrite step */}
        {step === 'rewrite' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {analysis && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <button className="btn btn-secondary" onClick={() => setStep('results')}>
                  ← Back to Analysis
                </button>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  ATS Score: <strong style={{ color: 'var(--electric)' }}>{analysis.atsScore}/100</strong>
                  {rewrittenResume && ' — Review the improved version below'}
                </div>
              </div>
            )}

            {error && (
              <div style={{
                padding: '12px 16px',
                background: 'rgba(239, 68, 68, 0.06)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: 8,
                color: 'var(--accent-red)',
                fontSize: 14
              }}>
                {error}
              </div>
            )}

            <RewritePanel
              rewrittenResume={rewrittenResume}
              resumeId={resumeData?.resumeId}
              onRewrite={handleRewrite}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
