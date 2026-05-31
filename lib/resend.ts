import { Resend } from 'resend'

let _resend: Resend | null = null
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY ?? 're_placeholder')
  return _resend
}

export async function sendBookingConfirmation({
  to,
  name,
  roomName,
  startTime,
  endTime,
  bookingId,
}: {
  to: string
  name: string
  roomName: string
  startTime: string
  endTime: string
  bookingId: string
}) {
  await getResend().emails.send({
    from: 'INFNTY Studio <bookings@infnty.studio>',
    to,
    subject: `Booking Confirmed – ${roomName}`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #000; color: #f5f5f5; padding: 40px; max-width: 600px; margin: 0 auto; border-radius: 16px;">
        <div style="margin-bottom: 32px;">
          <h1 style="color: #f43f5e; font-size: 28px; margin: 0;">INFNTY Studio</h1>
          <p style="color: #71717a; margin: 4px 0 0;">Your creative hub</p>
        </div>
        <h2 style="color: #f5f5f5; font-size: 22px;">Booking Confirmed ✓</h2>
        <p style="color: #a1a1aa;">Hi ${name},</p>
        <p style="color: #a1a1aa;">Your booking has been confirmed. Here are the details:</p>
        <div style="background: #111; border: 1px solid #222; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <p style="margin: 0 0 8px; color: #71717a; font-size: 13px;">ROOM</p>
          <p style="margin: 0 0 16px; color: #f5f5f5; font-size: 18px; font-weight: 600;">${roomName}</p>
          <p style="margin: 0 0 8px; color: #71717a; font-size: 13px;">DATE & TIME</p>
          <p style="margin: 0 0 16px; color: #f5f5f5;">${startTime} – ${endTime}</p>
          <p style="margin: 0 0 8px; color: #71717a; font-size: 13px;">BOOKING ID</p>
          <p style="margin: 0; color: #a1a1aa; font-size: 13px; font-family: monospace;">${bookingId}</p>
        </div>
        <p style="color: #a1a1aa; font-size: 14px;">Please arrive 5 minutes early. Note that a 15-minute buffer is applied after your session for room turnover.</p>
        <a href="https://infnty.studio/bookings" style="display: inline-block; background: #e11d48; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">View Booking</a>
        <p style="color: #52525b; font-size: 13px; margin-top: 32px;">INFNTY Studio · 24/7 Creator, Music & Content Hub</p>
      </div>
    `,
  })
}

export async function sendBookingCancellation({
  to,
  name,
  roomName,
  startTime,
}: {
  to: string
  name: string
  roomName: string
  startTime: string
}) {
  await getResend().emails.send({
    from: 'INFNTY Studio <bookings@infnty.studio>',
    to,
    subject: `Booking Cancelled – ${roomName}`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #000; color: #f5f5f5; padding: 40px; max-width: 600px; margin: 0 auto; border-radius: 16px;">
        <div style="margin-bottom: 32px;">
          <h1 style="color: #f43f5e; font-size: 28px; margin: 0;">INFNTY Studio</h1>
        </div>
        <h2 style="color: #f5f5f5; font-size: 22px;">Booking Cancelled</h2>
        <p style="color: #a1a1aa;">Hi ${name}, your booking for <strong>${roomName}</strong> on ${startTime} has been cancelled.</p>
        <p style="color: #a1a1aa;">If you did not request this cancellation, please contact us immediately.</p>
        <a href="https://infnty.studio/bookings/new" style="display: inline-block; background: #e11d48; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">Book Again</a>
      </div>
    `,
  })
}

export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: string
  name: string
}) {
  await getResend().emails.send({
    from: 'INFNTY Studio <hello@infnty.studio>',
    to,
    subject: 'Welcome to INFNTY Studio',
    html: `
      <div style="font-family: Arial, sans-serif; background: #000; color: #f5f5f5; padding: 40px; max-width: 600px; margin: 0 auto; border-radius: 16px;">
        <div style="margin-bottom: 32px;">
          <h1 style="color: #f43f5e; font-size: 28px; margin: 0;">INFNTY Studio</h1>
          <p style="color: #71717a; margin: 4px 0 0;">24/7 Creator, Music & Content Hub</p>
        </div>
        <h2 style="color: #f5f5f5; font-size: 22px;">Welcome, ${name}! 🎉</h2>
        <p style="color: #a1a1aa;">You're now part of INFNTY Studio — Amsterdam's premier creative hub for rehearsal, content creation, and music production.</p>
        <div style="background: #111; border: 1px solid #222; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <p style="color: #f5f5f5; font-weight: 600; margin: 0 0 16px;">What's next?</p>
          <ul style="color: #a1a1aa; padding-left: 20px; margin: 0;">
            <li style="margin-bottom: 8px;">Browse and book rehearsal rooms</li>
            <li style="margin-bottom: 8px;">Explore our Content Engine packages</li>
            <li style="margin-bottom: 8px;">Check out Sound Lab services</li>
            <li>Choose a subscription plan that fits your needs</li>
          </ul>
        </div>
        <a href="https://infnty.studio/dashboard" style="display: inline-block; background: #e11d48; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Go to Dashboard</a>
      </div>
    `,
  })
}
