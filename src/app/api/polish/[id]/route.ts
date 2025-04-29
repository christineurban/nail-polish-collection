import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const polish = await prisma.nail_polish.findUnique({
      where: { id: params.id },
      include: {
        brands: true,
      },
    });

    if (!polish) {
      return NextResponse.json(
        { error: 'Polish not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: polish.id,
      brand: polish.brands.name,
      name: polish.name,
    });
  } catch (error) {
    console.error('Error fetching polish:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
