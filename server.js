const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('public')); 

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post('/groq-chat', async (req, res) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Groq API key not configured. Add GROQ_API_KEY to .env.' });
  }

  const messages = req.body.messages;
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages payload.' });
  }

  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    const data = await groqResponse.json();
    if (!groqResponse.ok) {
      return res.status(500).json({ error: data?.error?.message || 'Groq request failed.' });
    }

    const reply = data?.choices?.[0]?.message?.content;
    return res.json({ reply: reply || 'No response from AI.' });
  } catch (error) {
    console.error('Groq chat error:', error);
    return res.status(500).json({ error: 'Server error while contacting Groq.' });
  }
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
