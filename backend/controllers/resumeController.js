import { extractTextFromPDF, cleanResumeText } from '../utils/pdfExtractor.js';
import Resume from '../models/Resume.js';

export async function uploadResume(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No PDF file uploaded' });
    }

    const { text } = await extractTextFromPDF(req.file.buffer);
    const cleanedText = cleanResumeText(text);

    if (!cleanedText || cleanedText.length < 100) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract readable text from PDF. Please ensure it is not a scanned image.'
      });
    }

    const resume = new Resume({
      originalText: cleanedText,
      fileName: req.file.originalname
    });

    await resume.save();

    res.json({
      success: true,
      resumeId: resume._id,
      text: cleanedText,
      fileName: req.file.originalname,
      charCount: cleanedText.length,
      wordCount: cleanedText.split(/\s+/).length
    });
  } catch (error) {
    next(error);
  }
}

export async function getResume(req, res, next) {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    res.json({ success: true, resume });
  } catch (error) {
    next(error);
  }
}
