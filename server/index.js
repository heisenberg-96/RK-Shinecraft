require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const apiRouter = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({
  contentSecurityPolicy: false // disabled so the static page's CDN scripts/fonts still load
}));
app.use(cors());
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true }));

// Basic rate limiting on the lead-capture endpoints to deter spam/abuse
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, errors: ['Too many requests. Please try again later.'] }
});
app.use('/api/contact', formLimiter);
app.use('/api/quote', formLimiter);

// API routes
app.use('/api', apiRouter);

// Static frontend (the Aethel Marble design, unchanged colors/fonts)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Fallback to index.html for any non-API route (simple SPA-style fallback)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use((req, res) => {
  res.status(404).json({ ok: false, errors: ['Not found'] });
});

app.listen(PORT, () => {
  console.log(`RK Shinecraft server running at http://localhost:${PORT}`);
});
