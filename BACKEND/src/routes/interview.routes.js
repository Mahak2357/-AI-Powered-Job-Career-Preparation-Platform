const { Router } = require('express');
const multer = require('multer');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { createInterviewReport, getInterviewReports, getInterviewReport } = require('../controllers/interview.controllers');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        const acceptedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        callback(null, acceptedTypes.includes(file.mimetype));
    },
});
const interviewRouter = Router();

interviewRouter.post('/', authenticateToken, upload.single('resume'), createInterviewReport);
interviewRouter.get('/', authenticateToken, getInterviewReports);
interviewRouter.get('/report/:interviewId', authenticateToken, getInterviewReport);

module.exports = interviewRouter;