import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hasImage = searchParams.get('hasImage');
    const search = searchParams.get('search') || '';
    const brands = searchParams.getAll('brand');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build the where clause
    const where: any = {};

    // Add image filter if provided
    if (hasImage !== null) {
      where.image_url = hasImage === 'true' ? { not: null } : null;
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

    // First, get all polishes that match the filters
    const polishes = await prisma.nail_polish.findMany({
      where,
      include: {
        brands: true,
      },
      orderBy: [
        { brands: { name: 'asc' } },
        { name: 'asc' }
      ],
      skip: (page - 1) * limit,
      take: limit,
    });

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
