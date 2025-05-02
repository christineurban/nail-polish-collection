import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

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

    // Update each polish
    const results = await Promise.all(
      updates.map(({ polishId, imageUrl }) =>
        prisma.nail_polish.update({
          where: { id: polishId },
          data: {
            image_url: imageUrl,
            updated_at: new Date()
          }
        })
      )
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
