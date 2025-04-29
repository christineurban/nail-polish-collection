import { prisma } from '@/lib/prisma';
import ImageSelectionClient from './ImageSelectionClient';

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
      brands: {
        select: {
          name: true
        }
      }
    }
  });

  return <ImageSelectionClient polishes={nailPolishes} />;
}
