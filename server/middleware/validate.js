function validateContact(req, res, next) {
  const { name, email, message } = req.body || {};
  const errors = [];

  if (!name || String(name).trim().length < 2) errors.push('Name is required (min 2 characters).');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('A valid email is required.');
  if (!message || String(message).trim().length < 5) errors.push('Message is required (min 5 characters).');
  if (req.body.phone && !/^[0-9+\-\s()]{7,20}$/.test(req.body.phone)) errors.push('Phone number format looks invalid.');

  if (errors.length) {
    return res.status(400).json({ ok: false, errors });
  }
  next();
}

function validateQuote(req, res, next) {
  const { name, email, phone, serviceType } = req.body || {};
  const errors = [];

  if (!name || String(name).trim().length < 2) errors.push('Name is required (min 2 characters).');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('A valid email is required.');
  if (!phone || !/^[0-9+\-\s()]{7,20}$/.test(phone)) errors.push('A valid phone number is required.');
  if (!serviceType || String(serviceType).trim().length < 2) errors.push('Please select a service type.');

  if (errors.length) {
    return res.status(400).json({ ok: false, errors });
  }
  next();
}

module.exports = { validateContact, validateQuote };
