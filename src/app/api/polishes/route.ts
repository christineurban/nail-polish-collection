import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hasImage = searchParams.get('hasImage');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  try {
    const [polishes, total] = await Promise.all([
      prisma.nail_polish.findMany({
        where: {
          image_url: hasImage === 'false' ? null : undefined,
          OR: search ? [
            { name: { contains: search, mode: 'insensitive' } },
            { brands: { name: { contains: search, mode: 'insensitive' } } }
          ] : undefined,
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
        ],
        skip,
        take: limit
      }),
      prisma.nail_polish.count({
        where: {
          image_url: hasImage === 'false' ? null : undefined,
          OR: search ? [
            { name: { contains: search, mode: 'insensitive' } },
            { brands: { name: { contains: search, mode: 'insensitive' } } }
          ] : undefined,
        }
      })
    ]);

    const transformedPolishes = polishes.map(polish => ({
      id: polish.id,
      brand: polish.brands.name,
      name: polish.name,
      imageUrl: polish.image_url,
      colors: polish.colors.map(c => c.color.name),
      finishes: polish.finishes.map(f => f.finish.name),
      rating: polish.rating,
      link: polish.link
    }));

    return NextResponse.json({
      polishes: transformedPolishes,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching polishes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch polishes' },
      { status: 500 }
    );
  }
}
