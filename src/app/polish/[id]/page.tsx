import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { NailPolishDetails } from '@/components/NailPolishDetails';
import type { NailPolishWithRelations } from '@/types/polish';
import type { Rating } from '@prisma/client';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function PolishPage({ params }: PageProps) {
  const [polish, brands, colors, finishes] = await Promise.all([
    prisma.nail_polish.findUnique({
      where: { id: params.id },
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
      }
    }) as Promise<NailPolishWithRelations | null>,
    prisma.brands.findMany({
      orderBy: { name: 'asc' },
      select: { name: true }
    }),
    prisma.colors.findMany({
      orderBy: { name: 'asc' },
      select: { name: true }
    }),
    prisma.finishes.findMany({
      orderBy: { name: 'asc' },
      select: { name: true }
    })
  ]);

  if (!polish) {
    notFound();
  }

  const transformedPolish = {
    id: polish.id,
    brand: polish.brands.name,
    name: polish.name,
    imageUrl: polish.image_url,
    colors: polish.colors.map(c => c.color.name),
    finishes: polish.finishes.map(f => f.finish.name),
    rating: polish.rating as Rating | null,
    link: polish.link,
    coats: polish.coats,
    notes: polish.notes,
    lastUsed: polish.last_used,
    totalBottles: polish.total_bottles,
    emptyBottles: polish.empty_bottles,
    isOld: polish.is_old
  };

  return (
    <NailPolishDetails
      polish={transformedPolish}
      brands={brands.map(b => b.name)}
      availableColors={colors.map(c => c.name)}
      availableFinishes={finishes.map(f => f.name)}
    />
  );
}
