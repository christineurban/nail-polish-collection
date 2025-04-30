import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PolishDetails } from '@/components/PolishDetails';
import { Prisma, nail_polish } from '@prisma/client';

interface PageProps {
  params: {
    id: string;
  };
}

interface NailPolishWithRelations extends nail_polish {
  brands: { id: string; name: string; created_at: Date; updated_at: Date };
  colors: {
    color: { id: string; name: string; created_at: Date; updated_at: Date };
    created_at: Date;
    updated_at: Date;
    nail_polish_id: string;
    color_id: string;
  }[];
  finishes: {
    finish: { id: string; name: string; created_at: Date; updated_at: Date };
    created_at: Date;
    updated_at: Date;
    nail_polish_id: string;
    finish_id: string;
  }[];
}

export default async function PolishPage({ params }: PageProps) {
  const polish = await prisma.nail_polish.findUnique({
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
  }) as NailPolishWithRelations | null;

  if (!polish) {
    notFound();
  }

  const transformedPolish = {
    id: polish.id,
    brand: polish.brands.name,
    name: polish.name,
    imageUrl: polish.image_url,
    color: polish.colors[0]?.color.name || '',
    finishes: polish.finishes.map(f => f.finish.name),
    rating: polish.rating,
    link: polish.link,
    coats: polish.coats,
    notes: polish.notes,
    lastUsed: polish.last_used,
    totalBottles: polish.total_bottles,
    emptyBottles: polish.empty_bottles,
    status: polish.status,
    isOld: polish.is_old
  };

  return <PolishDetails polish={transformedPolish} />;
}
