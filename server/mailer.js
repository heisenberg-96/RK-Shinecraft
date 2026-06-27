const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    // No SMTP configured — mailer will run in "log only" mode.
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });

  return transporter;
}

/**
 * Sends a notification email to the business inbox, and a confirmation
 * email to the customer. If SMTP is not configured (no .env values),
 * this simply logs the submission to the console instead of failing —
 * so the contact form keeps working out of the box during development.
 */
async function sendLeadNotification({ type, data }) {
  const tx = getTransporter();
  const businessEmail = process.env.BUSINESS_EMAIL || 'rkshinecraft@gmail.com';

  const subjectMap = {
    contact: `New Website Contact — ${data.name}`,
    quote: `New Quote Request — ${data.name}`
  };

  const bodyLines = Object.entries(data)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  if (!tx) {
    console.log('--- [MAILER] SMTP not configured, logging submission instead ---');
    console.log(subjectMap[type] || 'New Website Lead');
    console.log(bodyLines);
    console.log('-------------------------------------------------------------');
    return { delivered: false, logged: true };
  }

  await tx.sendMail({
    from: `"RK Shinecraft Website" <${process.env.SMTP_USER}>`,
    to: businessEmail,
    subject: subjectMap[type] || 'New Website Lead',
    text: bodyLines
  });

  if (data.email) {
    await tx.sendMail({
      from: `"RK Shinecraft" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: 'We received your request — RK Shinecraft',
      text: `Hi ${data.name},\n\nThank you for reaching out to RK Shinecraft. Our team has received your ${type === 'quote' ? 'quote request' : 'message'} and will contact you within one business day.\n\nWarm regards,\nRK Shinecraft Team\n+91 98315 85950 | rkshinecraft@gmail.com`
    });
  }

  return { delivered: true, logged: false };
}

module.exports = { sendLeadNotification };
