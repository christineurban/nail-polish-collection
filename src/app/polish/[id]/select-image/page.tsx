import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import SelectImageClient from './SelectImageClient';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function SelectImagePage({ params }: PageProps) {
  const polish = await prisma.nail_polish.findUnique({
    where: { id: params.id },
    include: {
      brands: true
    }
  });

  if (!polish || !polish.link) {
    notFound();
  }

  return (
    <SelectImageClient
      id={polish.id}
      name={polish.name}
      brand={polish.brands.name}
      link={polish.link}
    />
  );
}
