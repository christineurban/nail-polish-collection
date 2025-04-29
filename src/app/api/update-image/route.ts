import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { supabaseAdmin } from '@/lib/supabase';
import sharp from 'sharp';

const prisma = new PrismaClient();

async function uploadImageToSupabase(imageUrl: string, polishId: string): Promise<string> {
  // Fetch the image
  const response = await fetch(imageUrl);
  const imageBuffer = await response.arrayBuffer();

  // Compress the image using sharp
  const compressedImageBuffer = await sharp(Buffer.from(imageBuffer))
    .resize(800, 800, { // Resize to max dimensions while maintaining aspect ratio
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({ // Convert to JPEG and compress
      quality: 80,
      mozjpeg: true
    })
    .toBuffer();

  // Upload to Supabase storage
  const fileName = `${polishId}-${Date.now()}.jpg`;
  const { data, error } = await supabaseAdmin.storage
    .from('nail-polish-images')
    .upload(fileName, compressedImageBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    });

  if (error) {
    throw new Error(`Failed to upload image to Supabase: ${error.message}`);
  }

  // Get the public URL
  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('nail-polish-images')
    .getPublicUrl(fileName);

  return publicUrl;
}

export async function POST(request: Request) {
  try {
    const { id, imageUrl } = await request.json();

    // Enhanced input validation
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: id',
          details: 'The id field is required to identify the nail polish to update.'
        },
        { status: 400 }
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: imageUrl',
          details: 'The imageUrl field is required to update the nail polish image.'
        },
        { status: 400 }
      );
    }

    if (typeof imageUrl !== 'string' || !imageUrl.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid imageUrl format',
          details: 'The imageUrl must be a non-empty string.'
        },
        { status: 400 }
      );
    }

    // Upload image to Supabase storage
    const supabaseUrl = await uploadImageToSupabase(imageUrl.trim(), id);

    // Update database with Supabase URL
    const updatedPolish = await prisma.nail_polish.update({
      where: { id },
      data: {
        image_url: supabaseUrl,
        updated_at: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedPolish,
      message: 'Image updated successfully'
    });

  } catch (error: unknown) {
    console.error('Error updating image:', error);

    // Handle Prisma-specific errors
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          {
            success: false,
            error: 'Record not found',
            details: 'The specified nail polish id does not exist.'
          },
          { status: 404 }
        );
      }

      // Handle other database-related errors
      return NextResponse.json(
        {
          success: false,
          error: 'Database error',
          details: 'An error occurred while updating the database.',
          code: error.code
        },
        { status: 500 }
      );
    }

    // Handle all other errors
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: errorMessage
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
