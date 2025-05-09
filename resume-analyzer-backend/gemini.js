const axios = require('./node_modules/axios/index.d.cts');
require('dotenv').config();

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function analyzeResumeWithGemini(resumeText, jobDescription) {
  const prompt = `
Compare the following resume with the job description. Give:
- A match score out of 100
- A short summary of strengths
- A short summary of weaknesses
- Suggestions to improve resume for this job

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    const text = response.data.candidates[0]?.content?.parts[0]?.text || 'No response';
    return { analysis: text };
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    throw new Error('Failed to analyze resume with Gemini');
  }
}

module.exports = { analyzeResumeWithGemini };
