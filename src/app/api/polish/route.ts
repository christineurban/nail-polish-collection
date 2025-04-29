import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const polish = await prisma.nailPolish.create({
      data,
    });
    return NextResponse.json(polish);
  } catch (error) {
    console.error('Error creating nail polish:', error);
    return NextResponse.json(
      { error: 'Failed to create nail polish' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    const polish = await prisma.nailPolish.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(polish);
  } catch (error) {
    console.error('Error updating nail polish:', error);
    return NextResponse.json(
      { error: 'Failed to update nail polish' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.nailPolish.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting nail polish:', error);
    return NextResponse.json(
      { error: 'Failed to delete nail polish' },
      { status: 500 }
    );
  }
}
