import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hasImage = searchParams.get('hasImage');

  try {
    const polishes = await prisma.nail_polish.findMany({
      where: {
        image_url: hasImage === 'false' ? null : undefined,
      },
      include: {
        brands: true,
        colors: {
          include: {
            color: true
          }
        },
        finishes: {
          include: {
            finish: true
          }
        }
      },
      orderBy: [
        { brands: { name: 'asc' } },
        { name: 'asc' }
      ]
    });

    const transformedPolishes = polishes.map(polish => ({
      id: polish.id,
      brand: polish.brands.name,
      name: polish.name,
      imageUrl: polish.image_url,
      colors: polish.colors.map(c => c.color.name),
      finishes: polish.finishes.map(f => f.finish.name),
      rating: polish.rating,
    }));

    return NextResponse.json(transformedPolishes);
  } catch (error) {
    console.error('Error fetching polishes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch polishes' },
      { status: 500 }
    );
  }
}
