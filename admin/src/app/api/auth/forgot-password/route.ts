import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import DatabaseService from '@/lib/database';
import { emailService } from '@/lib/email-service';

// POST { email } → emails a one-hour reset link to <FRONTEND_URL>/reset-password?token=…
// The token itself is never stored, only its sha256 (auth/reset-password compares the hash).
// Always answers the same way so the endpoint can't be used to discover which emails have accounts.
export async function POST(request: NextRequest) {
  const generic = NextResponse.json({
    success: true,
    message: 'If an account exists for this email, a password reset link has been sent.',
  });

  let email = '';
  try {
    const body = await request.json();
    email = String(body.email ?? body.email_address ?? '').trim().toLowerCase();
  } catch { /* fall through */ }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ success: false, error: 'INVALID_EMAIL', message: 'Please enter a valid email address' }, { status: 400 });
  }

  const users = await DatabaseService.getCollection('users');
  const user = await users.findOne({ email_address: email, user_type: { $in: ['customer', 'astrologer'] } });
  if (!user) return generic;

  // ponytail: one reset email per 2 minutes per account; the global auth rate limit covers the rest
  if (user.password_reset_sent_at && Date.now() - new Date(user.password_reset_sent_at).getTime() < 2 * 60_000) return generic;

  const token = crypto.randomBytes(32).toString('hex');
  await users.updateOne({ _id: user._id }, {
    $set: {
      password_reset_token: crypto.createHash('sha256').update(token).digest('hex'),
      password_reset_expires: new Date(Date.now() + 60 * 60_000),
      password_reset_sent_at: new Date(),
    },
  });

  const link = `${process.env.FRONTEND_URL || 'https://astromate.online'}/reset-password?token=${token}`;
  const sent = await emailService.sendEmail({
    to: email,
    subject: 'Reset your Astromate password',
    html: emailService.layout(`
      <h2 style="margin:0 0 12px">Reset your password</h2>
      <p>Hi ${String(user.full_name || '').replace(/[<>&"]/g, '')},</p>
      <p>We received a request to reset your Astromate password. This link is valid for 1 hour.</p>
      <p style="margin:24px 0"><a href="${link}" style="background:#DB0007;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Reset password</a></p>
      <p style="font-size:13px;color:#666">If you didn't ask for this, ignore this email — your password stays the same.</p>`),
    text: `Reset your Astromate password (valid for 1 hour): ${link}`,
  });
  // Same answer either way (no account discovery); a send failure is for us to see in the logs.
  if (!sent) console.error(`forgot-password: reset email to ${email} was not sent (check SMTP settings)`);
  return generic;
}
