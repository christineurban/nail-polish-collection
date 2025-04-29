import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PolishDetails } from './PolishDetails';

interface PageProps {
  params: {
    id: string;
  };
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
  });

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
    purchaseYear: polish.purchase_year,
    lastUsed: polish.last_used,
    totalBottles: polish.total_bottles,
    emptyBottles: polish.empty_bottles,
    status: polish.status
  };

  return <PolishDetails polish={transformedPolish} />;
}
