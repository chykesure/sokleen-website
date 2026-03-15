import { NextResponse } from "next/server";
import { db } from "@/lib/db";
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

// Admin email template
const getAdminEmail = (data: Record<string, string | number | undefined>) => ({
  subject: "🧹 New Booking Request - SOKLEEN NIGERIA LTD",
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0071C5, #00B4D8); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .detail-row { display: flex; padding: 12px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: 600; width: 120px; color: #0071C5; }
        .detail-value { flex: 1; color: #333; }
        .highlight { background: #FFD700; padding: 3px 8px; border-radius: 4px; font-weight: 600; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🧹 New Booking Request</h1>
        <p>A new customer has requested a cleaning service</p>
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
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} SOKLEEN NIGERIA LTD</p>
        <p>WhatsApp: wa.me/2348132451474</p>
      </div>
    </body>
    </html>
  `,
});

// Customer confirmation email template
const getCustomerEmail = (data: Record<string, string | number | undefined>) => ({
  subject: "✅ Booking Confirmed - SOKLEEN NIGERIA LTD",
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0071C5, #00B4D8); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #eee; }
        .booking-card { background: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #0071C5; }
        .detail-row { display: flex; padding: 10px 0; }
        .detail-label { font-weight: 600; width: 120px; color: #64748b; }
        .detail-value { flex: 1; color: #1e293b; font-weight: 500; }
        .highlight { color: #0071C5; font-weight: 600; }
        .contact-box { background: #0071C5; color: white; padding: 25px; border-radius: 12px; text-align: center; margin: 25px 0; }
        .contact-box a { color: #FFD700; font-weight: 600; }
        .footer { background: #f8fafc; padding: 25px; text-align: center; border-radius: 0 0 10px 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Booking Received!</h1>
        <p>Thank you for choosing SOKLEEN NIGERIA LTD</p>
      </div>
      <div class="content">
        <p>Dear <strong>${data.name}</strong>,</p>
        <p>Thank you for booking with SOKLEEN NIGERIA LTD! Your cleaning service request has been received.</p>
        
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
        </div>
        
        <div class="contact-box">
          <h3 style="margin: 0 0 10px 0;">📞 Need Help?</h3>
          <p style="margin: 0;">WhatsApp: <a href="https://wa.me/2348132451474">+234 813 245 1474</a></p>
        </div>
        
        <p><strong>What happens next?</strong></p>
        <ol>
          <li>Our team will review your booking</li>
          <li>We'll contact you within 24 hours to confirm</li>
          <li>Final price will be confirmed before service</li>
        </ol>
      </div>
      <div class="footer">
        <p><strong>SOKLEEN NIGERIA LTD</strong></p>
        <p>House 16 Pamdale Estate, Ilesa, Osun State, Nigeria</p>
        <p>© ${new Date().getFullYear()} All rights reserved.</p>
      </div>
    </body>
    </html>
  `,
});

export async function GET() {
  try {
    const bookings = await db.booking.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, service, date, time, address, rooms, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !service || !date || !time || !address) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await db.booking.create({
      data: {
        name,
        email,
        phone,
        service,
        date,
        time,
        address,
        rooms: rooms || 1,
        message: message || null,
        status: "pending",
      },
    });

    // Send emails if configured
    if (process.env.EMAIL_APP_PASSWORD) {
      try {
        const transporter = createTransporter();
        const adminEmail = process.env.ADMIN_EMAIL || "Sokleennigeria7@gmail.com";
        const bookingData = { name, email, phone, service, date, time, address, rooms: rooms || 1, message };

        // 1. Send to ADMIN
        const adminTemplate = getAdminEmail(bookingData);
        await transporter.sendMail({
          from: `"SOKLEEN NIGERIA LTD" <${EMAIL_CONFIG.auth.user}>`,
          to: adminEmail,
          subject: adminTemplate.subject,
          html: adminTemplate.html,
          replyTo: email,
        });
        console.log(`✅ Admin email sent to: ${adminEmail}`);

        // 2. Send confirmation to CUSTOMER
        const customerTemplate = getCustomerEmail(bookingData);
        await transporter.sendMail({
          from: `"SOKLEEN NIGERIA LTD" <${EMAIL_CONFIG.auth.user}>`,
          to: email,
          subject: customerTemplate.subject,
          html: customerTemplate.html,
        });
        console.log(`✅ Customer email sent to: ${email}`);

      } catch (emailError) {
        console.error("Failed to send emails:", emailError);
        // Don't fail the booking if email fails
      }
    } else {
      console.log("📧 EMAIL_APP_PASSWORD not configured. Booking saved but emails not sent.");
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
