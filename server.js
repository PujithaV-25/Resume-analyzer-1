const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
require('dotenv').config();
const connectDB = require('./connectDB');
const analyzeRoute = require('./analyze');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // For serving PDFs if needed

app.use('/analyze', analyzeRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
