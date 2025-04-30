import { prisma } from '@/lib/prisma';
import { ImageSelector } from '@/components/ImageSelector';

export default async function ImageSelectionPage() {
  // Get all nail polishes with links
  const nailPolishes = await prisma.nail_polish.findMany({
    where: {
      link: {
        not: null
      }
    },
    select: {
      id: true,
      name: true,
      link: true,
      image_url: true,
      brands: {
        select: {
          name: true
        }
      }
    }
  });

  return <ImageSelector polishes={nailPolishes} />;
}
