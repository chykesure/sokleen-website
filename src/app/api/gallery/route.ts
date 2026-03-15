import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch all gallery images
export async function GET() {
  try {
    const images = await db.galleryImage.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ success: true, data: images });
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch gallery images" },
      { status: 500 }
    );
  }
}

// POST - Create a new gallery image
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, service, beforeImage, afterImage, beforeAlt, afterAlt, order } = body;

    if (!title || !beforeImage || !afterImage) {
      return NextResponse.json(
        { success: false, error: "Title, before image, and after image are required" },
        { status: 400 }
      );
    }

    const image = await db.galleryImage.create({
      data: {
        title,
        description: description || null,
        service: service || null,
        beforeImage,
        afterImage,
        beforeAlt: beforeAlt || null,
        afterAlt: afterAlt || null,
        order: order || 0,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, data: image });
  } catch (error) {
    console.error("Error creating gallery image:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create gallery image" },
      { status: 500 }
    );
  }
}
