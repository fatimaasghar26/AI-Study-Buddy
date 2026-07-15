const ALLOWED_ORIGINS = [
  'https://ai-study-buddy-beta-hazel.vercel.app',
  'http://localhost:3000'
];

const MAX_MESSAGES = 20;        // max turns kept in one conversation
const MAX_CHARS_PER_MESSAGE = 2000; // max length of a single message
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;     // per IP, per window

const SYSTEM_PROMPT =
  'You are AI Study Buddy, a helpful study assistant for university students. ' +
  'Answer questions clearly and concisely. Explain concepts step by step when needed, ' +
  'and keep responses easy to understand.';

const requestLog = new Map(); // ip -> array of timestamps

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  timestamps.push(now);
  requestLog.set(ip, timestamps);

  if (requestLog.size > 5000) {
    for (const [key, times] of requestLog) {
      if (times.every((t) => now - t > RATE_LIMIT_WINDOW_MS)) {
        requestLog.delete(key);
      }
    }
  }

  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Origin check — blocks other websites' scripts from calling this endpoint directly
  const origin = req.headers.origin;
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return res.status(403).json({ error: 'Requests from this origin are not allowed.' });
  }

  // 2. Rate limiting per IP
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute and try again.' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Groq API key not configured. Add GROQ_API_KEY in Vercel environment variables.' });
  }

  const incomingMessages = req.body?.messages;
  if (!Array.isArray(incomingMessages) || incomingMessages.length === 0) {
    return res.status(400).json({ error: 'Invalid messages payload.' });
  }

  const cleanMessages = [];
  for (const m of incomingMessages) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant')) continue;
    if (typeof m.content !== 'string' || m.content.trim() === '') continue;
    cleanMessages.push({
      role: m.role,
      content: m.content.slice(0, MAX_CHARS_PER_MESSAGE)
    });
  }

  if (cleanMessages.length === 0) {
    return res.status(400).json({ error: 'No valid messages found.' });
  }

  const trimmedMessages = cleanMessages.slice(-MAX_MESSAGES);
  const finalMessages = [{ role: 'system', content: SYSTEM_PROMPT }, ...trimmedMessages];

  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: finalMessages,
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    const data = await groqResponse.json();
    if (!groqResponse.ok) {
      return res.status(500).json({ error: data?.error?.message || 'Groq request failed.' });
    }

    const reply = data?.choices?.[0]?.message?.content;
    return res.status(200).json({ reply: reply || 'No response from AI.' });
  } catch (error) {
    console.error('Groq chat error:', error.message);
    return res.status(500).json({ error: 'Server error while contacting Groq.' });
  }
}
