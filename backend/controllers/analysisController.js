import Resume from '../models/Resume.js';
import { analyzeResume, rewriteResume } from '../utils/geminiService.js';

export async function runAnalysis(req, res, next) {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId) {
      return res.status(400).json({ success: false, message: 'Resume ID is required' });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // Run Gemini analysis
    const analysisResult = await analyzeResume(resume.originalText, jobDescription || '');

    // Save results
    resume.jobDescription = jobDescription || '';
    resume.analysis = analysisResult;
    await resume.save();

    res.json({
      success: true,
      resumeId: resume._id,
      analysis: analysisResult
    });
  } catch (error) {
    next(error);
  }
}

export async function runRewrite(req, res, next) {
  try {
    const { resumeId } = req.body;

    if (!resumeId) {
      return res.status(400).json({ success: false, message: 'Resume ID is required' });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    if (!resume.analysis || !resume.analysis.weaknesses?.length) {
      return res.status(400).json({
        success: false,
        message: 'Please run analysis first before requesting a rewrite'
      });
    }

    const rewritten = await rewriteResume(
      resume.originalText,
      resume.analysis,
      resume.jobDescription || ''
    );

    resume.rewrittenResume = rewritten;
    await resume.save();

    res.json({
      success: true,
      resumeId: resume._id,
      rewrittenResume: rewritten
    });
  } catch (error) {
    next(error);
  }
}

export async function downloadResume(req, res, next) {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    const content = resume.rewrittenResume || resume.originalText;
    const filename = `improved_${resume.fileName.replace('.pdf', '')}.txt`;

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(content);
  } catch (error) {
    next(error);
  }
}
