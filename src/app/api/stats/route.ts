import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { CollectionStats } from '@/types/stats';

export async function GET() {
  try {
    // Get total polishes
    const totalPolishes = await prisma.nail_polish.count();

    // Get total brands
    const totalBrands = await prisma.brands.count();

    // Get brand stats
    const brandStats = await prisma.brands.findMany({
      include: {
        _count: {
          select: { nail_polish: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Get color stats
    const colorStats = await prisma.colors.findMany({
      include: {
        _count: {
          select: { nail_polish: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Get finish stats
    const finishStats = await prisma.finishes.findMany({
      include: {
        _count: {
          select: { nail_polish: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    const stats: CollectionStats = {
      totalPolishes,
      totalBrands,
      brandStats: brandStats.map(brand => ({
        name: brand.name,
        count: brand._count.nail_polish,
        percentage: (brand._count.nail_polish / totalPolishes) * 100
      })),
      colorStats: colorStats.map(color => ({
        name: color.name,
        count: color._count.nail_polish,
        percentage: (color._count.nail_polish / totalPolishes) * 100
      })),
      finishStats: finishStats.map(finish => ({
        name: finish.name,
        count: finish._count.nail_polish,
        percentage: (finish._count.nail_polish / totalPolishes) * 100
      }))
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
