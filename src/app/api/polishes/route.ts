import { PrismaClient, type nail_polish } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hasImage = searchParams.get('hasImage');
    const search = searchParams.get('search') || '';
    const brands = searchParams.getAll('brand');
    const colors = searchParams.getAll('color');
    const finishes = searchParams.getAll('finish');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build the where clause
    const where: any = {};

    // Add image filter if provided
    if (hasImage !== null) {
      if (hasImage === 'true') {
        where.AND = [{
          NOT: {
            OR: [
              { image_url: null },
              { image_url: 'n/a' }
            ]
          }
        }];
      } else {
        where.AND = [{
          image_url: null // Only include polishes with no image, exclude 'n/a'
        }];
      }
    }

    // Add search filter if provided
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brands: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    // Add brand filter if provided
    if (brands.length > 0) {
      where.brands = {
        name: { in: brands }
      };
    }

    // Add color filter if provided
    if (colors.length > 0) {
      where.colors = {
        some: {
          color: {
            name: { in: colors, mode: 'insensitive' }
          }
        }
      };
    }

    // Add finish filter if provided
    if (finishes.length > 0) {
      where.finishes = {
        some: {
          finish: {
            name: { in: finishes, mode: 'insensitive' }
          }
        }
      };
    }

    console.log('Query where clause:', JSON.stringify(where, null, 2));

    // First, get all polishes that match the filters
    const polishes = await prisma.nail_polish.findMany({
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
      skip: (page - 1) * limit,
      take: limit,
    });

    console.log('Found polishes:', polishes.length);
    if (polishes.length > 0) {
      console.log('Sample polish colors:', polishes[0].colors.map(c => c.color.name));
    }

    // Get total count for pagination
    const total = await prisma.nail_polish.count({
      where,
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      polishes: polishes.map(polish => ({
        id: polish.id,
        name: polish.name,
        link: polish.link,
        imageUrl: polish.image_url,
        brand: polish.brands.name,
        rating: polish.rating,
        colors: polish.colors.map(c => c.color.name),
        finishes: polish.finishes.map(f => f.finish.name),
        noImageAvailable: polish.image_url === 'n/a'
      })),
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching polishes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch polishes' },
      { status: 500 }
    );
  }
}
