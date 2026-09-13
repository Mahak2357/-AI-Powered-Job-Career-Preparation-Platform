const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: String,
    intention: String,
    answer: String,
}, { _id: false });

const interviewReportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    jobDescription: { type: String, required: true },
    selfDescription: { type: String, required: true },
    resume: {
        originalName: String,
        mimeType: String,
        size: Number,
    },
    resumeAnalysis: {
        status: { type: String, enum: ['not_provided', 'analyzed', 'unavailable'], default: 'not_provided' },
        detectedSkills: [String],
        missingSkills: [String],
        suitableRoles: [String],
        readinessScore: Number,
        recommendations: [String],
    },
    matchScore: { type: Number, default: 0 },
    skillGaps: [{ skill: String, severity: String }],
    technicalQuestions: [questionSchema],
    behavioralQuestions: [questionSchema],
    preparationPlan: [{ day: Number, focus: String, tasks: [mongoose.Schema.Types.Mixed], notes: [String], tips: [String] }],
}, { timestamps: true });

module.exports = mongoose.model('InterviewReport', interviewReportSchema);