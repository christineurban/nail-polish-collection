import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hasImage = searchParams.get('hasImage');
  const search = searchParams.get('search');
  const brands = searchParams.getAll('brand');
  const finishes = searchParams.getAll('finish');
  const colors = searchParams.getAll('color');
  const ratings = searchParams.getAll('rating');
  const isOld = searchParams.get('isOld');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '45');
  const skip = (page - 1) * limit;

  try {
    const where: any = {};

    // Handle hasImage filter
    if (hasImage === 'false') {
      where.image_url = null;
    }

    // Handle search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brands: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    // Handle brand filter
    if (brands.length > 0) {
      where.brands = {
        name: {
          in: brands
        }
      };
    }

    // Handle finish filter
    if (finishes.length > 0) {
      where.finishes = {
        some: {
          finish: {
            name: {
              in: finishes
            }
          }
        }
      };
    }

    // Handle color filter
    if (colors.length > 0) {
      where.colors = {
        some: {
          color: {
            name: {
              in: colors
            }
          }
        }
      };
    }

    // Handle rating filter
    if (ratings.length > 0) {
      where.rating = {
        in: ratings
      };
    }

    // Handle isOld filter
    if (isOld === 'true') {
      where.is_old = true;
    }

    const [polishes, total] = await Promise.all([
      prisma.nail_polish.findMany({
        where,
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
        where
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
