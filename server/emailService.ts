import nodemailer from 'nodemailer';

// SMTP configuration from environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(
  to: string,
  token: string,
  firstName?: string
) {
  const verificationUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/api/auth/verify-email?token=${token}`;

  try {
    await transporter.sendMail({
      from: `"DentalSecondOpinion" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject: 'Verify your email address',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">DentalSecondOpinion</h1>
  </div>
  
  <div style="background: white; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <h2 style="color: #1f2937; margin-top: 0;">Welcome${firstName ? ` ${firstName}` : ''}!</h2>
    
    <p style="color: #4b5563; font-size: 16px;">
      Thank you for signing up with DentalSecondOpinion. Please verify your email address to activate your account and start getting professional dental second opinions.
    </p>
    
    <div style="text-align: center; margin: 40px 0;">
      <a href="${verificationUrl}" 
         style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                padding: 14px 32px; 
                text-decoration: none; 
                border-radius: 6px; 
                font-weight: 600;
                display: inline-block;
                font-size: 16px;">
        Verify Email Address
      </a>
    </div>
    
    <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
      Or copy and paste this link into your browser:
    </p>
    <p style="color: #667eea; font-size: 14px; word-break: break-all;">
      ${verificationUrl}
    </p>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
        This link will expire in 24 hours. If you didn't create an account with DentalSecondOpinion, you can safely ignore this email.
      </p>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 20px;">
    <p style="color: #9ca3af; font-size: 12px;">
      © ${new Date().getFullYear()} DentalSecondOpinion. All rights reserved.
    </p>
  </div>
</body>
</html>
      `,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

export async function sendWelcomeEmail(
  to: string,
  firstName?: string
) {
  try {
    await transporter.sendMail({
      from: `"DentalSecondOpinion" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject: 'Welcome to DentalSecondOpinion!',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome!</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome to DentalSecondOpinion!</h1>
  </div>
  
  <div style="background: white; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
    <h2 style="color: #1f2937; margin-top: 0;">Hi${firstName ? ` ${firstName}` : ''}!</h2>
    
    <p style="color: #4b5563; font-size: 16px;">
      Your email has been successfully verified! You're now ready to upload your dental images and get professional second opinions.
    </p>
    
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
      <h3 style="color: #1f2937; margin-top: 0;">What you can do now:</h3>
      <ul style="color: #4b5563; padding-left: 20px;">
        <li style="margin-bottom: 10px;">Upload your dental X-rays, OPT, or CBCT scans</li>
        <li style="margin-bottom: 10px;">Get instant AI-powered analysis for 9.90 CHF</li>
        <li style="margin-bottom: 10px;">Request expert dentist reviews for 60 CHF</li>
        <li>Save money on dental treatments with independent second opinions</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 40px 0;">
      <a href="${process.env.BASE_URL || 'http://localhost:5000'}/dashboard" 
         style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                padding: 14px 32px; 
                text-decoration: none; 
                border-radius: 6px; 
                font-weight: 600;
                display: inline-block;
                font-size: 16px;">
        Go to Dashboard
      </a>
    </div>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 14px;">
        Questions? Contact us at <a href="mailto:info@dentalsecondopinion.ch" style="color: #667eea;">info@dentalsecondopinion.ch</a>
      </p>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 20px;">
    <p style="color: #9ca3af; font-size: 12px;">
      © ${new Date().getFullYear()} DentalSecondOpinion. All rights reserved.
    </p>
  </div>
</body>
</html>
      `,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}
