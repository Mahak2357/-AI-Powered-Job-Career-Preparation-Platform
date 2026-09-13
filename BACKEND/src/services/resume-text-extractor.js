const mammoth = require('mammoth');
const { PDFParse } = require('pdf-parse');

const MAX_RESUME_TEXT_LENGTH = 12000;
const MIN_RESUME_TEXT_LENGTH = 80;

const normalizeText = (text) => text.replace(/\s+/g, ' ').trim().slice(0, MAX_RESUME_TEXT_LENGTH);

const isPdf = (file) => file.mimetype === 'application/pdf' && file.buffer.subarray(0, 5).toString('ascii') === '%PDF-';
const isDocx = (file) => file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && file.buffer.subarray(0, 2).toString('ascii') === 'PK';

async function extractResumeText(file) {
    if (!file?.buffer?.length) {
        return { status: 'unavailable', text: null };
    }

    try {
        let rawText;
        if (isPdf(file)) {
            const parser = new PDFParse({ data: file.buffer });
            const result = await parser.getText();
            await parser.destroy();
            rawText = result.text;
        } else if (isDocx(file)) {
            const result = await mammoth.extractRawText({ buffer: file.buffer });
            rawText = result.value;
        } else {
            return { status: 'unavailable', text: null };
        }

        const text = normalizeText(rawText || '');
        if (text.length < MIN_RESUME_TEXT_LENGTH) {
            return { status: 'unavailable', text: null };
        }
        return { status: 'analyzed', text };
    } catch (error) {
        console.warn('Resume text extraction failed:', error.name || 'UnknownError');
        return { status: 'unavailable', text: null };
    }
}

module.exports = { extractResumeText };
