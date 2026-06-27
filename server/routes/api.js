const express = require('express');
const { v4: uuidv4 } = require('uuid');

const db = require('../db');
const { sendLeadNotification } = require('../mailer');
const { validateContact, validateQuote } = require('../middleware/validate');
const services = require('../data/services.json');
const company = require('../data/company.json');

const router = express.Router();

/* ----------------------------- Content API ----------------------------- */

router.get('/company', (req, res) => {
  res.json({ ok: true, data: company });
});

router.get('/services', (req, res) => {
  res.json({ ok: true, data: services });
});

/* ----------------------------- Contact form ------------------------------ */

router.post('/contact', validateContact, async (req, res) => {
  try {
    const { name, email, phone = '', serviceType = 'General Inquiry', message } = req.body;

    const entry = {
      id: uuidv4(),
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      serviceType: String(serviceType).trim(),
      message: String(message).trim(),
      createdAt: new Date().toISOString(),
      source: 'contact-form'
    };

    db.get('inquiries').push(entry).write();

    const mailResult = await sendLeadNotification({ type: 'contact', data: entry });

    res.status(201).json({
      ok: true,
      message: 'Thank you — your message has been received. Our concierge team will be in touch shortly.',
      delivered: mailResult.delivered
    });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ ok: false, errors: ['Something went wrong. Please try again or call us directly.'] });
  }
});

/* ------------------------------ Quote request ----------------------------- */

router.post('/quote', validateQuote, async (req, res) => {
  try {
    const { name, email, phone, serviceType, propertyType = '', notes = '' } = req.body;

    const entry = {
      id: uuidv4(),
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      serviceType: String(serviceType).trim(),
      propertyType: String(propertyType).trim(),
      notes: String(notes).trim(),
      createdAt: new Date().toISOString(),
      source: 'quote-request'
    };

    db.get('quotes').push(entry).write();

    const mailResult = await sendLeadNotification({ type: 'quote', data: entry });

    res.status(201).json({
      ok: true,
      message: 'Your free consultation request has been received. We will call you within one business day.',
      delivered: mailResult.delivered
    });
  } catch (err) {
    console.error('Quote request error:', err);
    res.status(500).json({ ok: false, errors: ['Something went wrong. Please try again or call us directly.'] });
  }
});

module.exports = router;
