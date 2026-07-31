const nodemailer = require('nodemailer');

const ADMIN_EMAIL = process.env.CONTACT_TO_EMAIL || '26spahikristi@gmail.com';

function getTransporter() {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

async function notifyAdmin({ subject, text, html }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.log('[mailer] SMTP not configured. Would notify:', ADMIN_EMAIL, subject);
    console.log(text);
    return { sent: false, reason: 'SMTP not configured' };
  }
  await transporter.sendMail({
    from: `"Kujto Tiranën" <${process.env.SMTP_USER}>`,
    to: ADMIN_EMAIL,
    subject,
    text,
    html: html || `<pre>${text}</pre>`,
  });
  return { sent: true };
}

async function notifyNewPhoto(photo) {
  return notifyAdmin({
    subject: `[Kujto Tiranën] Foto e re për aprovim — ${photo.locationKey}`,
    text: `Lokacioni: ${photo.locationKey}\nViti: ${photo.year}\nCaption: ${photo.caption}\nNga: ${photo.contributor.firstName} ${photo.contributor.lastName} <${photo.contributor.email}>\n\nHap admin: ${process.env.FRONTEND_URL || 'http://localhost:5000'}/admin`,
    html: `<h2>Foto e re në pritje</h2>
      <p><b>Lokacioni:</b> ${photo.locationKey}</p>
      <p><b>Viti:</b> ${photo.year}</p>
      <p><b>Caption:</b> ${photo.caption}</p>
      <p><b>Kontribues:</b> ${photo.contributor.firstName} ${photo.contributor.lastName} (${photo.contributor.email})</p>
      <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}/admin">Hap panelin admin</a></p>`,
  });
}

async function notifyNewComment(comment) {
  return notifyAdmin({
    subject: `[Kujto Tiranën] Koment i ri — ${comment.locationKey}`,
    text: `Lokacioni: ${comment.locationKey}\nKoment: ${comment.text}\nNga: ${comment.authorName}\n\nAdmin: ${process.env.FRONTEND_URL || 'http://localhost:5000'}/admin`,
  });
}

async function notifyContact(contact) {
  return notifyAdmin({
    subject: `[Kujto Tiranën] Mesazh kontakti nga ${contact.name}`,
    text: `Emri: ${contact.name}\nEmail: ${contact.email}\nTel: ${contact.phone || '-'}\n\n${contact.message}`,
  });
}

module.exports = { notifyAdmin, notifyNewPhoto, notifyNewComment, notifyContact, ADMIN_EMAIL };
