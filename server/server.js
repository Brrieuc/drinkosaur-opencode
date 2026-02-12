import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
// Simple rate limiter for the proxy
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// Simple CORS with allow-list from env
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '*').split(',').map(o => o.trim()).filter(o => o.length > 0);
const corsOptions: any = {
  origin: function(origin: string | undefined, callback: any) {
    if (!origin) return callback(null, true); // allow non-browser requests (e.g., curl)
    if (allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Simple API-key protection for the proxy
const verifyKey = (req) => {
  const envKey = process.env.PROXY_API_KEY;
  if (!envKey) return true; // allow if not configured (development)
  const provided = (req.headers['x-api-key'] || '') as string;
  return provided === envKey;
};

app.post('/parse-drink', async (req, res) => {
  const { description } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!verifyKey(req)) {
    return res.status(401).json({ error: 'Unauthorized: invalid API key' });
  }
  if (!apiKey) {
    return res.status(503).json({ error: 'Gemini API key not configured (GEMINI_API_KEY missing)' });
  }
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Extract drink details from this description: "${description}". Return JSON. Estimate standard values if not specified. Icon should be a single emoji.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            volumeMl: { type: Type.NUMBER },
            abv: { type: Type.NUMBER },
            icon: { type: Type.STRING }
          },
          required: ['name', 'volumeMl', 'abv', 'icon']
        }
      }
    });
    const text = response?.text;
    if (!text) {
      return res.status(500).json({ error: 'Invalid response from Gemini' });
    }
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (e) {
    console.error('Gemini proxy error', e);
    res.status(500).json({ error: 'Gemini request failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Gemini proxy listening on port ${PORT}`);
});
