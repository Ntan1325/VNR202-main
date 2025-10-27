import { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Chỉ cho phép POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { rating, feedback, email, language } = req.body;

    // Validate required fields
    if (!rating || !feedback) {
      return res.status(400).json({ error: 'Rating and feedback are required' });
    }

    // Email template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Feedback mới từ VNR202</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #ef4444, #eab308, #a855f7); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h1 style="color: white; margin: 0; text-align: center;">📝 Feedback mới từ VNR202</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #ef4444; margin-top: 0;">Thông tin Feedback</h2>
              
              <div style="margin-bottom: 15px;">
                <strong>⭐ Đánh giá:</strong> 
                <span style="color: #eab308; font-size: 18px;">
                  ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)} (${rating}/5)
                </span>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong>📧 Email người gửi:</strong> 
                ${email ? `<a href="mailto:${email}" style="color: #a855f7;">${email}</a>` : 'Không cung cấp'}
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong>🌐 Ngôn ngữ:</strong> ${language || 'vi'}
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong>📅 Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}
              </div>
            </div>
            
            <div style="background: white; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
              <h3 style="color: #ef4444; margin-top: 0;">Nội dung Feedback</h3>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${feedback}</div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
              <p style="margin: 0; color: #666;">
                Email này được gửi tự động từ hệ thống VNR202<br>
                <small>VNR202 - Nền tảng học tập về Lịch sử Đảng Cộng sản Việt Nam</small>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Gửi email notification
    const { data, error } = await resend.emails.send({
      from: 'VNR202 Feedback <noreply@vnr202.edu.vn>',
      to: [process.env.NOTIFICATION_EMAIL || 'huyhanhoppo@gmail.com'],
      subject: `📝 Feedback mới từ VNR202 - Đánh giá ${rating}/5`,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email notification' });
    }

    console.log('Email sent successfully:', data);
    return res.status(200).json({ 
      success: true, 
      message: 'Feedback notification sent successfully',
      emailId: data?.id 
    });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
