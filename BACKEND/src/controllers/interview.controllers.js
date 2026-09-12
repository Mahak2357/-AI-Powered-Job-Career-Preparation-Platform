const InterviewReport = require('../models/interview-report.model');

const createInterviewReport = async (req, res, next) => {
    try {
        const { jobDescription, selfDescription } = req.body;
        if (!jobDescription || !selfDescription) {
            return res.status(400).json({ message: 'Job description and profile information are required.' });
        }

        const report = await InterviewReport.create({
            userId: req.user.id,
            title: jobDescription.split('.')[0].slice(0, 100) || 'Interview Preparation Plan',
            jobDescription,
            selfDescription,
            resume: req.file ? { originalName: req.file.originalname, mimeType: req.file.mimetype, size: req.file.size } : undefined,
            matchScore: 0,
            skillGaps: [],
            technicalQuestions: [],
            behavioralQuestions: [],
            preparationPlan: [],
        });

        return res.status(201).json({ interviewReport: report });
    } catch (error) {
        return next(error);
    }
};

const getInterviewReports = async (req, res, next) => {
    try {
        const interviewReports = await InterviewReport.find({ userId: req.user.id }).sort({ createdAt: -1 });
        return res.status(200).json({ interviewReports });
    } catch (error) {
        return next(error);
    }
};

const getInterviewReport = async (req, res, next) => {
    try {
        const interviewReport = await InterviewReport.findOne({ _id: req.params.interviewId, userId: req.user.id });
        if (!interviewReport) {
            return res.status(404).json({ message: 'Interview report not found.' });
        }
        return res.status(200).json({ interviewReport });
    } catch (error) {
        return next(error);
    }
};

module.exports = { createInterviewReport, getInterviewReports, getInterviewReport };