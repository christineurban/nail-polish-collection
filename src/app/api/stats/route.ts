import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { CollectionStats } from '@/types/stats';

const ratingToNumber = (rating: string | null): number => {
  if (!rating) return 0;
  const ratingMap: { [key: string]: number } = {
    'A_PLUS': 4.3,
    'A': 4.0,
    'A_MINUS': 3.7,
    'B_PLUS': 3.3,
    'B': 3.0,
    'B_MINUS': 2.7,
    'C_PLUS': 2.3,
    'C': 2.0,
    'C_MINUS': 1.7,
    'D_PLUS': 1.3,
    'D': 1.0,
    'D_MINUS': 0.7,
    'F': 0.0
  };
  return ratingMap[rating] || 0;
};

export async function GET() {
  try {
    // Get total polishes
    const totalPolishes = await prisma.nail_polish.count();

    // Get total brands
    const totalBrands = await prisma.brands.count();

    // Get total colors
    const totalColors = await prisma.colors.count();

    // Get total finishes
    const totalFinishes = await prisma.finishes.count();

    // Get all ratings
    const polishesWithRatings = await prisma.nail_polish.findMany({
      select: {
        rating: true
      }
    });

    // Calculate average rating
    const totalRating = polishesWithRatings.reduce((sum, polish) => {
      return sum + ratingToNumber(polish.rating || null);
    }, 0);
    const averageRating = polishesWithRatings.length > 0
      ? totalRating / polishesWithRatings.length
      : 0;

    // Get brand stats with highest count
    const mostCommonBrand = await prisma.brands.findMany({
      include: {
        _count: {
          select: { nail_polish: true }
        }
      },
      orderBy: {
        nail_polish: {
          _count: 'desc'
        }
      },
      take: 1
    });

    // Get color stats with highest count
    const mostCommonColor = await prisma.colors.findMany({
      include: {
        _count: {
          select: { nail_polish: true }
        }
      },
      orderBy: {
        nail_polish: {
          _count: 'desc'
        }
      },
      take: 1
    });

    // Get finish stats with highest count
    const mostCommonFinish = await prisma.finishes.findMany({
      include: {
        _count: {
          select: { nail_polish: true }
        }
      },
      orderBy: {
        nail_polish: {
          _count: 'desc'
        }
      },
      take: 1
    });

    const stats = {
      totalPolishes,
      totalBrands,
      totalColors,
      totalFinishes,
      averageRating,
      mostCommonBrand: {
        name: mostCommonBrand[0]?.name || 'N/A',
        count: mostCommonBrand[0]?._count.nail_polish || 0
      },
      mostCommonColor: {
        name: mostCommonColor[0]?.name || 'N/A',
        count: mostCommonColor[0]?._count.nail_polish || 0
      },
      mostCommonFinish: {
        name: mostCommonFinish[0]?.name || 'N/A',
        count: mostCommonFinish[0]?._count.nail_polish || 0
      }
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
