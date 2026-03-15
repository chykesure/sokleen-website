import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const contacts = await db.contact.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json({ success: true, data: contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create contact
    const contact = await db.contact.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
      },
    });

    // Send notification email (fire and forget)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          data: {
            name,
            email,
            phone: phone || "Not provided",
            message,
          },
        }),
      });
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true, data: contact });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit contact form" },
      { status: 500 }
    );
  }
}
