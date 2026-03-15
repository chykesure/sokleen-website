import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch a single gallery image
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const image = await db.galleryImage.findUnique({
      where: { id },
    });

    if (!image) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: image });
  } catch (error) {
    console.error("Error fetching gallery image:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch gallery image" },
      { status: 500 }
    );
  }
}

// PUT - Update a gallery image
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, service, beforeImage, afterImage, beforeAlt, afterAlt, order, isActive } = body;

    const existingImage = await db.galleryImage.findUnique({
      where: { id },
    });

    if (!existingImage) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 }
      );
    }

    const updatedImage = await db.galleryImage.update({
      where: { id },
      data: {
        title: title ?? existingImage.title,
        description: description ?? existingImage.description,
        service: service ?? existingImage.service,
        beforeImage: beforeImage ?? existingImage.beforeImage,
        afterImage: afterImage ?? existingImage.afterImage,
        beforeAlt: beforeAlt ?? existingImage.beforeAlt,
        afterAlt: afterAlt ?? existingImage.afterAlt,
        order: order ?? existingImage.order,
        isActive: isActive ?? existingImage.isActive,
      },
    });

    return NextResponse.json({ success: true, data: updatedImage });
  } catch (error) {
    console.error("Error updating gallery image:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update gallery image" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a gallery image
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const existingImage = await db.galleryImage.findUnique({
      where: { id },
    });

    if (!existingImage) {
      return NextResponse.json(
        { success: false, error: "Image not found" },
        { status: 404 }
      );
    }

    await db.galleryImage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete gallery image" },
      { status: 500 }
    );
  }
}
