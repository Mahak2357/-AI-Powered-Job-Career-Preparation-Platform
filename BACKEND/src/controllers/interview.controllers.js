const { GoogleGenAI } = require('@google/genai');
const InterviewReport = require('../models/interview-report.model');

const createPreparationContent = async ({ jobDescription, selfDescription }) => {
    if (!process.env.GEMINI_API_KEY) {
        const error = new Error('Gemini is not configured. Add GEMINI_API_KEY to BACKEND/.env and restart the server.');
        error.status = 503;
        throw error;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `You are an expert technical interview coach. Create a detailed, actionable preparation plan.

Target: ${jobDescription}
Candidate profile: ${selfDescription}

Return only valid JSON with this exact shape:
{
  "matchScore": 0,
  "skillGaps": [{ "skill": "string", "severity": "low|medium|high" }],
  "technicalQuestions": [{ "question": "string", "intention": "string", "answer": "string" }],
  "behavioralQuestions": [{ "question": "string", "intention": "string", "answer": "string" }],
  "preparationPlan": [{ "day": 1, "focus": "string", "tasks": ["string"], "notes": ["string"], "tips": ["string"] }]
}

Requirements: return 6 technical questions and 4 behavioral questions. Return a 14-day plan with 2 or 3 concise, actionable tasks every day. If the target includes DSA, include concrete DSA topics, patterns, and at least one relevant LeetCode-style problem in every applicable day. Answers must explain the approach, complexity, and common mistakes. Notes should be concise concepts to remember; tips should be practical interview advice. Never use markdown or code fences.`;

    const configuredModel = (process.env.GEMINI_MODEL || 'gemini-3.6-flash').replace(/^models\//, '');
    const retiredModels = new Set(['gemini-1.5-flash', 'gemini-2.5-flash']);
    const model = retiredModels.has(configuredModel) ? 'gemini-3.6-flash' : configuredModel;
    if (configuredModel !== model) {
        console.warn(`Ignoring retired GEMINI_MODEL=${configuredModel}; using gemini-3.6-flash instead.`);
    }

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: 'application/json', maxOutputTokens: 16384 },
    });

    const responseText = response.text || response.candidates?.[0]?.content?.parts
        ?.map((part) => part.text)
        .filter(Boolean)
        .join('');
    let content;
    try {
        content = JSON.parse(responseText);
    } catch (parseError) {
        const error = new Error('Gemini returned an invalid preparation plan. Please try again.');
        error.status = 502;
        throw error;
    }

    if (!Array.isArray(content.technicalQuestions) || !Array.isArray(content.preparationPlan)) {
        const error = new Error('Gemini returned an incomplete preparation plan. Please try again.');
        error.status = 502;
        throw error;
    }

    return content;
};

const normalizePreparationPlan = (plan = []) => plan.map((day, dayIndex) => ({
    ...day,
    day: day.day || dayIndex + 1,
    tasks: (day.tasks || []).map((task, taskIndex) => {
        if (typeof task === 'string') {
            return { title: task, xp: 25 + (taskIndex % 3) * 5, completed: false, completedAt: null };
        }
        return {
            title: task.title || task.task || `Practice task ${taskIndex + 1}`,
            xp: Number.isFinite(task.xp) ? Math.max(10, Math.min(100, task.xp)) : 25 + (taskIndex % 3) * 5,
            completed: Boolean(task.completed),
            completedAt: task.completedAt || null,
        };
    }),
}));

const createLegacyPreparationPlan = (jobDescription = '') => {
    const role = jobDescription.split('.')[0].trim() || 'your target role';
    const focusAreas = [
        'Resume and target-role analysis', 'Arrays and strings', 'Hash maps and sliding window', 'Linked lists, stacks, and queues',
        'Trees and recursion', 'Graphs and traversal patterns', 'Dynamic programming', 'System design foundations',
        'APIs, databases, and trade-offs', 'Behavioral STAR stories', 'Mock coding interview', 'Mock system-design interview',
        'Company research and question practice', 'Final review and interview routine',
    ];
    return focusAreas.map((focus, index) => ({
        day: index + 1,
        focus,
        tasks: [
            { title: `Review the core concepts for ${focus.toLowerCase()}`, xp: 20, completed: false, completedAt: null },
            { title: `Complete two focused ${focus.toLowerCase()} practice exercises`, xp: 20, completed: false, completedAt: null },
            { title: `Write a concise explanation of your approach for ${role}`, xp: 15, completed: false, completedAt: null },
            { title: `Record one improvement for your next ${focus.toLowerCase()} session`, xp: 15, completed: false, completedAt: null },
        ],
        notes: ['Focus on a clear approach before optimizing.'],
        tips: ['Practice explaining your decisions out loud.'],
    }));
};

const ensurePreparationPlan = async (interviewReport) => {
    const currentPlan = interviewReport.preparationPlan || [];
    const needsBackfill = !currentPlan.length || currentPlan.some((day) => !Array.isArray(day.tasks) || day.tasks.length < 2);
    if (needsBackfill) {
        interviewReport.preparationPlan = createLegacyPreparationPlan(interviewReport.jobDescription);
    } else if (currentPlan.some((day) => day.tasks.some((task) => typeof task === 'string'))) {
        interviewReport.preparationPlan = normalizePreparationPlan(currentPlan);
    } else {
        return interviewReport;
    }
    await interviewReport.save();
    return interviewReport;
};

const getGamification = (plan) => {
    const tasks = plan.flatMap((day) => day.tasks || []);
    const completedTasks = tasks.filter((task) => task.completed);
    const totalXp = tasks.reduce((sum, task) => sum + task.xp, 0);
    const earnedXp = completedTasks.reduce((sum, task) => sum + task.xp, 0);
    const completedDays = plan.filter((day) => day.tasks?.length && day.tasks.every((task) => task.completed)).length;
    const completedWeeks = Array.from({ length: Math.ceil(plan.length / 7) }, (_, weekIndex) => plan.slice(weekIndex * 7, weekIndex * 7 + 7)).filter((week) => week.length && week.every((day) => day.tasks?.length && day.tasks.every((task) => task.completed))).length;
    const completionDates = [...new Set(completedTasks.map((task) => task.completedAt && new Date(task.completedAt).toISOString().slice(0, 10)).filter(Boolean))];
    const today = new Date();
    let streak = 0;
    for (let offset = 0; ; offset += 1) {
        const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - offset)).toISOString().slice(0, 10);
        if (!completionDates.includes(date)) break;
        streak += 1;
    }
    const badges = [
        completedTasks.length >= 1 && { label: 'First Step', detail: 'Completed your first task' },
        completedDays >= 3 && { label: 'Momentum', detail: 'Finished 3 preparation days' },
        completedWeeks >= 1 && { label: 'Week Winner', detail: 'Completed a full week' },
        earnedXp >= 500 && { label: 'Focused 500', detail: 'Earned 500 XP' },
    ].filter(Boolean);
    return {
        totalTasks: tasks.length,
        completedTasks: completedTasks.length,
        percentage: tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0,
        earnedXp,
        totalXp,
        level: Math.floor(earnedXp / 250) + 1,
        nextLevelXp: (Math.floor(earnedXp / 250) + 1) * 250,
        streak,
        completedDays,
        completedWeeks,
        badges,
    };
};

const serializeReport = (report) => {
    const serialized = report.toObject ? report.toObject() : report;
    const preparationPlan = normalizePreparationPlan(serialized.preparationPlan);
    return { ...serialized, preparationPlan, gamification: getGamification(preparationPlan) };
};

const createInterviewReport = async (req, res, next) => {
    try {
        const { jobDescription, selfDescription } = req.body;
        if (!jobDescription || !selfDescription) {
            return res.status(400).json({ message: 'Job description and profile information are required.' });
        }

        const content = await createPreparationContent({ jobDescription, selfDescription });
        const report = await InterviewReport.create({
            userId: req.user.id,
            title: jobDescription.split('.')[0].slice(0, 100) || 'Interview Preparation Plan',
            jobDescription,
            selfDescription,
            resume: req.file ? { originalName: req.file.originalname, mimeType: req.file.mimetype, size: req.file.size } : undefined,
            matchScore: Number.isFinite(content.matchScore) ? Math.min(100, Math.max(0, content.matchScore)) : 0,
            skillGaps: Array.isArray(content.skillGaps) ? content.skillGaps : [],
            technicalQuestions: content.technicalQuestions,
            behavioralQuestions: Array.isArray(content.behavioralQuestions) ? content.behavioralQuestions : [],
            preparationPlan: normalizePreparationPlan(content.preparationPlan),
        });

        return res.status(201).json({ interviewReport: serializeReport(report) });
    } catch (error) {
        return next(error);
    }
};

const getInterviewReports = async (req, res, next) => {
    try {
        const interviewReports = await InterviewReport.find({ userId: req.user.id }).sort({ createdAt: -1 });
        await Promise.all(interviewReports.map(ensurePreparationPlan));
        return res.status(200).json({ interviewReports: interviewReports.map(serializeReport) });
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
        await ensurePreparationPlan(interviewReport);
        return res.status(200).json({ interviewReport: serializeReport(interviewReport) });
    } catch (error) {
        return next(error);
    }
};

const updateTaskCompletion = async (req, res, next) => {
    try {
        const { completed } = req.body;
        const dayIndex = Number(req.params.dayIndex);
        const taskIndex = Number(req.params.taskIndex);
        if (!Number.isInteger(dayIndex) || !Number.isInteger(taskIndex) || typeof completed !== 'boolean') {
            return res.status(400).json({ message: 'A valid task and completion state are required.' });
        }

        const interviewReport = await InterviewReport.findOne({ _id: req.params.interviewId, userId: req.user.id });
        if (!interviewReport) return res.status(404).json({ message: 'Interview report not found.' });

        await ensurePreparationPlan(interviewReport);
        const preparationPlan = normalizePreparationPlan(interviewReport.preparationPlan);
        const task = preparationPlan[dayIndex]?.tasks?.[taskIndex];
        if (!task) return res.status(404).json({ message: 'Roadmap task not found.' });

        task.completed = completed;
        task.completedAt = completed ? new Date() : null;
        interviewReport.preparationPlan = preparationPlan;
        interviewReport.markModified('preparationPlan');
        await interviewReport.save();
        return res.status(200).json({ interviewReport: serializeReport(interviewReport) });
    } catch (error) {
        return next(error);
    }
};

module.exports = { createInterviewReport, getInterviewReports, getInterviewReport, updateTaskCompletion };