import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';

export default function UploadZone({ file, onFile, onClear }) {
  const onDrop = useCallback((accepted) => {
    if (accepted[0]) onFile(accepted[0]);
  }, [onFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: !!file
  });

  if (file) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '16px 20px',
        background: 'rgba(59, 130, 246, 0.05)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: 'var(--radius)',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 8,
          background: 'rgba(59, 130, 246, 0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <FileText size={20} color="var(--electric)" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {file.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            {(file.size / 1024).toFixed(0)} KB · PDF
          </div>
        </div>
        <button onClick={onClear} className="btn btn-ghost" style={{ padding: '6px', borderRadius: '6px' }}>
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      style={{
        border: `2px dashed ${isDragActive ? 'var(--electric)' : 'var(--border-light)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '48px 24px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        background: isDragActive ? 'var(--electric-glow)' : 'transparent',
      }}
    >
      <input {...getInputProps()} />
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: isDragActive ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 16px',
        transition: 'all 0.2s'
      }}>
        <Upload size={24} color={isDragActive ? 'var(--electric)' : 'var(--text-muted)'} />
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, marginBottom: 6 }}>
        {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
      </div>
      <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16 }}>
        Drag & drop a PDF file, or click to browse
      </div>
      <span className="badge badge-blue">PDF only · Max 5MB</span>
    </div>
  );
}
