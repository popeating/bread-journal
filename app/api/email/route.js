import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request) {
  try {
    const { type, email, displayName, verificationLink } = await request.json();

    let mailOptions;

    if (type === 'verification') {
      mailOptions = {
        from: 'noreply@popland.it',
        to: email,
        subject: 'Verify your email address',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333; text-align: center;">Welcome to Recipe App!</h1>
            <p style="color: #666;">Hi ${displayName},</p>
            <p style="color: #666;">Thank you for signing up. Please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" 
                 style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            <p style="color: #666;">If you didn't create an account, you can safely ignore this email.</p>
            <p style="color: #666;">Best regards,<br>Recipe App Team</p>
          </div>
        `,
      };
    } else if (type === 'welcome') {
      mailOptions = {
        from: 'noreply@popland.it',
        to: email,
        subject: 'Welcome to Recipe App!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333; text-align: center;">Email Verified Successfully!</h1>
            <p style="color: #666;">Hi ${displayName},</p>
            <p style="color: #666;">Thank you for verifying your email address. Your account is now fully activated!</p>
            <p style="color: #666;">You can now:</p>
            <ul style="color: #666;">
              <li>Create and share recipes</li>
              <li>View your public profile</li>
              <li>Access all features of the app</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
                 style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Go to Dashboard
              </a>
            </div>
            <p style="color: #666;">Best regards,<br>Recipe App Team</p>
          </div>
        `,
      };
    }

    await transporter.sendMail(mailOptions);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return Response.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
