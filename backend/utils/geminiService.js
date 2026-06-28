import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function getModel() {
  return genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
}

export async function analyzeResume(resumeText, jobDescription = '') {
  const model = getModel();

  const hasJD = jobDescription && jobDescription.trim().length > 0;

  const prompt = `You are an expert ATS (Applicant Tracking System) and resume analyst. Analyze the following resume${hasJD ? ' against the provided job description' : ''} and return a detailed JSON analysis.

RESUME TEXT:
${resumeText}

${hasJD ? `JOB DESCRIPTION:\n${jobDescription}` : ''}

Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
  "atsScore": <number 0-100>,
  "sectionScores": {
    "contact": <number 0-100>,
    "summary": <number 0-100>,
    "experience": <number 0-100>,
    "education": <number 0-100>,
    "skills": <number 0-100>,
    "formatting": <number 0-100>
  },
  "strengths": [<list of 4-6 specific strengths as strings>],
  "weaknesses": [<list of 4-6 specific weaknesses as strings>],
  "skillsFound": [<list of technical and soft skills identified in resume>],
  "skillsGap": [${hasJD ? '<list of skills required in JD but missing from resume>' : '"No job description provided - upload a JD for skill gap analysis"'}],
  "keywordsFound": [<list of strong ATS keywords found>],
  "keywordsMissing": [${hasJD ? '<list of important JD keywords missing from resume>' : '"Add a job description to see missing keywords"'}],
  "suggestions": [<list of 6-8 specific, actionable improvement suggestions>],
  "overallFeedback": "<2-3 sentence overall assessment>"
}

Be specific and actionable. Base ATS score on: keyword density, formatting quality, section completeness, quantified achievements, action verbs, and${hasJD ? ' JD alignment' : ' industry standards'}.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Strip markdown code blocks if present
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    throw new Error('Failed to parse AI analysis response');
  }
}

export async function rewriteResume(resumeText, analysisData, jobDescription = '') {
  const model = getModel();

  const hasJD = jobDescription && jobDescription.trim().length > 0;

  const prompt = `You are an expert resume writer with 15+ years of experience crafting ATS-optimized resumes for top companies.

ORIGINAL RESUME:
${resumeText}

${hasJD ? `TARGET JOB DESCRIPTION:\n${jobDescription}\n` : ''}

IDENTIFIED WEAKNESSES TO FIX:
${analysisData.weaknesses.join('\n')}

SUGGESTED IMPROVEMENTS:
${analysisData.suggestions.join('\n')}

Rewrite this resume with these goals:
1. Fix all identified weaknesses
2. Add strong action verbs and quantify achievements where possible
3. Improve ATS keyword density${hasJD ? ' to match the job description' : ''}
4. Ensure all sections are complete and well-structured
5. Make it concise, impactful, and professional
6. Keep all factual information accurate — only improve presentation

Return the complete rewritten resume as plain text, properly formatted with clear section headers (use ALL CAPS for headers like PROFESSIONAL SUMMARY, WORK EXPERIENCE, EDUCATION, SKILLS, etc.).

Do NOT include any explanation — return ONLY the rewritten resume text.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}

export async function generateDownloadableResume(rewrittenText) {
  // Returns the text formatted for download
  return rewrittenText;
}
