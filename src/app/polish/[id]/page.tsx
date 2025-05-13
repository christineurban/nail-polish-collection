'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { NailPolishDetails } from '@/components/NailPolishDetails';
import { PageHeader } from '@/components/PageHeader';
import type { Rating } from '@prisma/client';

interface PageProps {
  params: {
    id: string;
  };
}

interface Polish {
  id: string;
  brand: string;
  name: string;
  imageUrl: string | null;
  colors: string[];
  finishes: string[];
  rating: Rating | null;
  link: string | null;
  coats: number | null;
  notes: string | null;
  lastUsed: Date | null;
  totalBottles: number;
  emptyBottles: number;
  isOld: boolean;
}

export default function Page({ params }: PageProps) {
  const [polish, setPolish] = useState<Polish | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPolish = async () => {
      try {
        const response = await fetch(`/api/polish/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch polish');
        const data = await response.json();
        setPolish(data);
      } catch (error) {
        console.error('Error fetching polish:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolish();
  }, [params.id]);

  if (isLoading) {
    return <PageHeader title="Loading..." />;
  }

  if (!polish) {
    notFound();
  }

  return <NailPolishDetails polish={polish} />;
}
