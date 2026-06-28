import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  originalText: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    default: ''
  },
  analysis: {
    atsScore: { type: Number, default: 0 },
    strengths: [String],
    weaknesses: [String],
    skillsFound: [String],
    skillsGap: [String],
    suggestions: [String],
    sectionScores: {
      contact: { type: Number, default: 0 },
      summary: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      education: { type: Number, default: 0 },
      skills: { type: Number, default: 0 },
      formatting: { type: Number, default: 0 }
    },
    keywordsFound: [String],
    keywordsMissing: [String],
    overallFeedback: { type: String, default: '' }
  },
  rewrittenResume: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Auto-delete after 24 hours
  }
});

export default mongoose.model('Resume', resumeSchema);
