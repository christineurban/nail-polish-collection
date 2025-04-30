import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Polish ID is required' }, { status: 400 });
    }

    await prisma.nail_polish.update({
      where: { id },
      data: {
        image_url: null
      }
    });

    return NextResponse.json({ message: 'Image removed successfully' });
  } catch (error) {
    console.error('Error removing image:', error);
    return NextResponse.json({ error: 'Failed to remove image' }, { status: 500 });
  }
}
