import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Email configuration
const EMAIL_CONFIG = {
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "Sokleennigeria7@gmail.com",
    pass: process.env.EMAIL_APP_PASSWORD,
  },
};

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: EMAIL_CONFIG.service,
    auth: EMAIL_CONFIG.auth,
    secure: true,
    port: 465,
  });
};

// Format date for display
const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString("en-NG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
};

// Format service name
const formatService = (service: string) => {
  const serviceNames: Record<string, string> = {
    "deep-cleaning": "Deep Cleaning",
    "commercial-cleaning": "Commercial Cleaning",
    "residential-cleaning": "Residential Cleaning",
    "upholstery-cleaning": "Upholstery Cleaning",
    "fumigation": "Fumigation",
    "post-construction": "Post-Construction Cleaning",
  };
  return serviceNames[service] || service;
};

// Admin notification email template
const getAdminEmailTemplate = (data: Record<string, string | number | undefined>) => {
  return {
    subject: "🧹 New Booking Request - SOKLEEN NIGERIA LTD",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0071C5, #00B4D8); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 10px 0 0; opacity: 0.9; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .detail-row { display: flex; padding: 12px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: 600; width: 120px; color: #0071C5; }
          .detail-value { flex: 1; color: #333; }
          .highlight { background: #FFD700; padding: 3px 8px; border-radius: 4px; font-weight: 600; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .cta-button { display: inline-block; background: #0071C5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🧹 New Booking Request</h1>
          <p>A new customer has requested a cleaning service</p>
        </div>
        <div class="content">
          <p style="margin-bottom: 20px;">A new booking has been submitted through your website. Below are the details:</p>
          
          <div class="detail-row">
            <span class="detail-label">👤 Name:</span>
            <span class="detail-value">${data.name}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">📧 Email:</span>
            <span class="detail-value"><a href="mailto:${data.email}">${data.email}</a></span>
          </div>
          <div class="detail-row">
            <span class="detail-label">📱 Phone:</span>
            <span class="detail-value"><a href="tel:${data.phone}">${data.phone}</a></span>
          </div>
          <div class="detail-row">
            <span class="detail-label">🧹 Service:</span>
            <span class="detail-value"><span class="highlight">${formatService(data.service as string)}</span></span>
          </div>
          <div class="detail-row">
            <span class="detail-label">📅 Date:</span>
            <span class="detail-value">${formatDate(data.date as string)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">⏰ Time:</span>
            <span class="detail-value">${data.time}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">🏠 Address:</span>
            <span class="detail-value">${data.address}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">🚪 Rooms:</span>
            <span class="detail-value">${data.rooms || 1}</span>
          </div>
          ${data.message ? `
          <div class="detail-row" style="border-bottom: none;">
            <span class="detail-label">💬 Message:</span>
            <span class="detail-value">${data.message}</span>
          </div>
          ` : ''}
          
          <div style="margin-top: 30px; padding: 20px; background: #0071C5; color: white; border-radius: 10px; text-align: center;">
            <p style="margin: 0;">📞 Contact the customer promptly to confirm the booking!</p>
            <a href="tel:${data.phone}" class="cta-button">Call Customer Now</a>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} SOKLEEN NIGERIA LTD. All rights reserved.</p>
          <p>House 16 Pamdale Estate, Osun Ankara Estate, Ilesa, Osun State, Nigeria</p>
          <p>WhatsApp: wa.me/2348132451474</p>
        </div>
      </body>
      </html>
    `,
    text: `
NEW BOOKING REQUEST - SOKLEEN NIGERIA LTD
==========================================

Customer Details:
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone}

Booking Details:
- Service: ${formatService(data.service as string)}
- Date: ${formatDate(data.date as string)}
- Time: ${data.time}
- Address: ${data.address}
- Rooms: ${data.rooms || 1}
${data.message ? `- Message: ${data.message}` : ''}

Please contact the customer promptly to confirm the booking.

---
SOKLEEN NIGERIA LTD
House 16 Pamdale Estate, Osun Ankara Estate, Ilesa, Osun State, Nigeria
WhatsApp: wa.me/2348132451474
    `,
  };
};

// Customer confirmation email template
const getCustomerEmailTemplate = (data: Record<string, string | number | undefined>) => {
  return {
    subject: "✅ Booking Confirmed - SOKLEEN NIGERIA LTD",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0071C5, #00B4D8); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header img { width: 80px; height: 80px; margin-bottom: 15px; }
          .header h1 { margin: 0; font-size: 26px; }
          .header p { margin: 10px 0 0; opacity: 0.9; font-size: 16px; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #eee; }
          .success-badge { background: #10B981; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; display: inline-block; margin-bottom: 20px; }
          .booking-card { background: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #0071C5; }
          .detail-row { display: flex; padding: 10px 0; }
          .detail-label { font-weight: 600; width: 120px; color: #64748b; }
          .detail-value { flex: 1; color: #1e293b; font-weight: 500; }
          .highlight { color: #0071C5; font-weight: 600; }
          .contact-box { background: linear-gradient(135deg, #0071C5, #00B4D8); color: white; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0; }
          .contact-box a { color: #FFD700; font-weight: 600; }
          .footer { background: #f8fafc; padding: 25px; text-align: center; border-radius: 0 0 10px 10px; border-top: 1px solid #eee; }
          .footer-logo { font-size: 18px; font-weight: bold; color: #0071C5; margin-bottom: 10px; }
          .social-links { margin: 15px 0; }
          .social-links a { display: inline-block; margin: 0 10px; color: #0071C5; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎉 Booking Received!</h1>
          <p>Thank you for choosing SOKLEEN NIGERIA LTD</p>
        </div>
        <div class="content">
          <div class="success-badge">✓ Successfully Submitted</div>
          
          <p>Dear <strong>${data.name}</strong>,</p>
          
          <p>Thank you for booking with SOKLEEN NIGERIA LTD! Your cleaning service request has been received and is being processed.</p>
          
          <div class="booking-card">
            <h3 style="margin: 0 0 15px 0; color: #0071C5;">📋 Your Booking Details</h3>
            <div class="detail-row">
              <span class="detail-label">Service:</span>
              <span class="detail-value highlight">${formatService(data.service as string)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${formatDate(data.date as string)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time:</span>
              <span class="detail-value">${data.time}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Location:</span>
              <span class="detail-value">${data.address}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Rooms:</span>
              <span class="detail-value">${data.rooms || 1}</span>
            </div>
            ${data.message ? `
            <div class="detail-row">
              <span class="detail-label">Notes:</span>
              <span class="detail-value">${data.message}</span>
            </div>
            ` : ''}
          </div>
          
          <div class="contact-box">
            <h3 style="margin: 0 0 10px 0;">📞 Need to Make Changes?</h3>
            <p style="margin: 0 0 15px 0;">Contact us anytime via WhatsApp or call</p>
            <p style="margin: 0; font-size: 20px; font-weight: bold;">
              <a href="https://wa.me/2348132451474">💬 Chat on WhatsApp</a>
            </p>
            <p style="margin: 10px 0 0 0;">or call: <a href="tel:+2348132451474">+234 813 245 1474</a></p>
          </div>
          
          <p><strong>What happens next?</strong></p>
          <ol style="padding-left: 20px; color: #64748b;">
            <li>Our team will review your booking</li>
            <li>We'll contact you within 24 hours to confirm</li>
            <li>A free on-site assessment may be scheduled</li>
            <li>Final price will be confirmed before service</li>
          </ol>
        </div>
        <div class="footer">
          <div class="footer-logo">SOKLEEN NIGERIA LTD</div>
          <p style="margin: 0; color: #64748b; font-size: 14px;">
            House 16 Pamdale Estate, Osun Ankara Estate<br>
            Ilesa, Osun State, Nigeria
          </p>
          <div class="social-links">
            <a href="https://wa.me/2348132451474">WhatsApp</a>
            <a href="https://instagram.com/sokleennigerialtd">Instagram</a>
            <a href="https://tiktok.com/@sokleennigerialtd">TikTok</a>
          </div>
          <p style="margin-top: 15px; font-size: 12px; color: #94a3b8;">
            © ${new Date().getFullYear()} SOKLEEN NIGERIA LTD. All rights reserved.
          </p>
        </div>
      </body>
      </html>
    `,
    text: `
BOOKING CONFIRMED - SOKLEEN NIGERIA LTD
========================================

Dear ${data.name},

Thank you for booking with SOKLEEN NIGERIA LTD! Your cleaning service request has been received.

YOUR BOOKING DETAILS:
- Service: ${formatService(data.service as string)}
- Date: ${formatDate(data.date as string)}
- Time: ${data.time}
- Location: ${data.address}
- Rooms: ${data.rooms || 1}
${data.message ? `- Notes: ${data.message}` : ''}

WHAT HAPPENS NEXT?
1. Our team will review your booking
2. We'll contact you within 24 hours to confirm
3. A free on-site assessment may be scheduled
4. Final price will be confirmed before service

NEED TO MAKE CHANGES?
WhatsApp: wa.me/2348132451474
Phone: +234 813 245 1474
Email: Sokleennigeria7@gmail.com

---
SOKLEEN NIGERIA LTD
House 16 Pamdale Estate, Osun Ankara Estate, Ilesa, Osun State, Nigeria
    `,
  };
};

// Contact form email template
const getContactEmailTemplate = (data: Record<string, string | undefined>) => {
  return {
    subject: "📨 New Contact Form Message - SOKLEEN NIGERIA LTD",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0071C5, #00B4D8); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .detail-row { display: flex; padding: 12px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: 600; width: 100px; color: #0071C5; }
          .detail-value { flex: 1; color: #333; }
          .message-box { background: white; padding: 20px; border-radius: 10px; border-left: 4px solid #0071C5; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📨 New Contact Message</h1>
        </div>
        <div class="content">
          <div class="detail-row">
            <span class="detail-label">👤 Name:</span>
            <span class="detail-value">${data.name}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">📧 Email:</span>
            <span class="detail-value"><a href="mailto:${data.email}">${data.email}</a></span>
          </div>
          <div class="detail-row">
            <span class="detail-label">📱 Phone:</span>
            <span class="detail-value"><a href="tel:${data.phone}">${data.phone}</a></span>
          </div>
          <div class="message-box">
            <h4 style="margin: 0 0 10px; color: #0071C5;">Message:</h4>
            <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} SOKLEEN NIGERIA LTD. All rights reserved.</p>
        </div>
      </body>
      </html>
    `,
    text: `
NEW CONTACT MESSAGE - SOKLEEN NIGERIA LTD
==========================================

- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone || 'Not provided'}

Message:
${data.message}

---
SOKLEEN NIGERIA LTD
    `,
  };
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data, to } = body;

    // Check if email is configured
    if (!process.env.EMAIL_APP_PASSWORD) {
      console.error("EMAIL_APP_PASSWORD not configured");
      console.log("Email data that would be sent:", { type, data, to });
      
      return NextResponse.json({ 
        success: false, 
        error: "Email service not configured. Please add EMAIL_APP_PASSWORD to environment variables.",
      }, { status: 500 });
    }

    const transporter = createTransporter();
    const adminEmail = process.env.ADMIN_EMAIL || "Sokleennigeria7@gmail.com";
    const emailsSent: string[] = [];

    // Handle different email types
    if (type === "booking") {
      // 1. Send email to ADMIN with booking details
      const adminTemplate = getAdminEmailTemplate(data);
      await transporter.sendMail({
        from: `"SOKLEEN NIGERIA LTD" <${EMAIL_CONFIG.auth.user}>`,
        to: adminEmail,
        subject: adminTemplate.subject,
        html: adminTemplate.html,
        text: adminTemplate.text,
        replyTo: data.email as string,
      });
      emailsSent.push(`Admin: ${adminEmail}`);

      // 2. Send confirmation email to CUSTOMER
      if (data.email) {
        const customerTemplate = getCustomerEmailTemplate(data);
        await transporter.sendMail({
          from: `"SOKLEEN NIGERIA LTD" <${EMAIL_CONFIG.auth.user}>`,
          to: data.email as string,
          subject: customerTemplate.subject,
          html: customerTemplate.html,
          text: customerTemplate.text,
        });
        emailsSent.push(`Customer: ${data.email}`);
      }

      console.log(`✅ Booking emails sent to: ${emailsSent.join(", ")}`);

    } else if (type === "contact") {
      // Send contact form notification to admin
      const contactTemplate = getContactEmailTemplate(data);
      await transporter.sendMail({
        from: `"SOKLEEN NIGERIA LTD" <${EMAIL_CONFIG.auth.user}>`,
        to: adminEmail,
        subject: contactTemplate.subject,
        html: contactTemplate.html,
        text: contactTemplate.text,
        replyTo: data.email as string,
      });
      emailsSent.push(`Admin: ${adminEmail}`);

      console.log(`✅ Contact email sent to: ${emailsSent.join(", ")}`);

    } else {
      // Generic email
      const { subject, html, text } = body;
      await transporter.sendMail({
        from: `"SOKLEEN NIGERIA LTD" <${EMAIL_CONFIG.auth.user}>`,
        to: to || adminEmail,
        subject,
        html,
        text,
      });
      emailsSent.push(to || adminEmail);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Emails sent successfully to: ${emailsSent.join(", ")}`,
      recipients: emailsSent,
    });

  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email: " + (error as Error).message },
      { status: 500 }
    );
  }
}
