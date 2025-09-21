require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // <--- Keep only this one!

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Your Gemini API key (replace with yours or use process.env)

// Middleware to allow JSON POST bodies
app.use(express.json());

// Home route for health check
app.get('/', (req, res) => {
  res.send('Backend Server Running');
});

// Gemini route
app.post('/gemini', async (req, res) => {
  const prompt = req.body.prompt;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    res.json({ response: result.data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);  
  });   
