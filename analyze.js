const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const axios = require('axios');
const { MongoClient } = require('mongodb');
const router = express.Router();

// File upload config
const upload = multer({ dest: 'uploads/' });

// POST /api/analyze
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const jobDescription = req.body.jobDescription;
    const resumePath = req.file.path;

    // Parse PDF
    const dataBuffer = fs.readFileSync(resumePath);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    // Store in MongoDB
    const mongoClient = new MongoClient(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    const db = mongoClient.db();
    await db.collection('analyzed_resumes').insertOne({
      resumeText,
      jobDescription,
      createdAt: new Date(),
    });

    // Call Gemini API
    const prompt = `
Compare the following resume to the job description and provide:
- Match score (0-100)
- Summary of strengths and weaknesses
- Suggestions for improvement

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

    const geminiRes = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + process.env.GEMINI_API_KEY,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    const resultText = geminiRes.data.candidates[0].content.parts[0].text;

    res.json({ success: true, result: resultText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Analysis failed' });
  }
});

module.exports = router;
