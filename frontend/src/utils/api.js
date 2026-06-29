import axios from 'axios';

const api = axios.create({
  baseURL: 'https://resume-analyser-backend-production-b331.up.railway.app/api',
  timeout: 120000 // 2 min for AI calls
});

export async function uploadResumePDF(file) {
  const formData = new FormData();
  formData.append('resume', file);

  const { data } = await api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
}

export async function analyzeResume(resumeId, jobDescription = '') {
  const { data } = await api.post('/analysis/analyze', { resumeId, jobDescription });
  return data;
}

export async function rewriteResume(resumeId) {
  const { data } = await api.post('/analysis/rewrite', { resumeId });
  return data;
}

export function getDownloadUrl(resumeId) {
  return `${baseURL}/api/analysis/download/${resumeId}`;
}
