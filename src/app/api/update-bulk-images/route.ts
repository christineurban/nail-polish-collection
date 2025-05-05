import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { uploadImageToSupabase } from '@/lib/utils/image';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { updates } = await request.json();

    // Validate request body
    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Process each update
    const results = await Promise.all(
      updates.map(async ({ polishId, imageUrl }) => {
        // Get polish details first
        const polish = await prisma.nail_polish.findUnique({
          where: { id: polishId },
          include: { brands: true }
        });

        if (!polish) {
          throw new Error(`Polish not found with ID: ${polishId}`);
        }

        // Get current image URL to delete old image if it exists
        if (polish.image_url && polish.image_url !== 'n/a') {
          try {
            const url = new URL(polish.image_url);
            const pathParts = url.pathname.split('/');
            const oldFileName = pathParts[pathParts.length - 1];

            await supabaseAdmin.storage
              .from('nail-polish-images')
              .remove([oldFileName]);
          } catch (error) {
            console.error('Error deleting old image:', error);
          }
        }

        // Upload new image and get URL
        const newImageUrl = await uploadImageToSupabase(imageUrl, polish);

        // Update database
        return prisma.nail_polish.update({
          where: { id: polishId },
          data: {
            image_url: newImageUrl,
            updated_at: new Date()
          }
        });
      })
    );

    return NextResponse.json({
      success: true,
      message: `Updated ${results.length} polishes`,
      data: results
    });

  } catch (error) {
    console.error('Error updating polish images:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update polish images',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
