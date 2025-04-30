'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { NailPolishGrid } from '@/components/NailPolishGrid';
import { Rating } from '@prisma/client';

interface Polish {
  id: string;
  brand: string;
  name: string;
  imageUrl: string | null;
  colors: string[];
  finishes: string[];
  rating: Rating | null;
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [polishes, setPolishes] = useState<Polish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract unique values for filters
  const brands = polishes
    .map(polish => polish.brand)
    .filter((brand, index, self) => self.indexOf(brand) === index)
    .sort();
  const colors = polishes
    .flatMap(polish => polish.colors)
    .filter((color, index, self) => self.indexOf(color) === index)
    .sort();
  const finishes = polishes
    .flatMap(polish => polish.finishes)
    .filter((finish, index, self) => self.indexOf(finish) === index)
    .sort();

  // Get current filters from URL
  const currentFilters = {
    brand: searchParams.getAll('brand'),
    finish: searchParams.getAll('finish'),
    color: searchParams.getAll('color'),
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || '',
    rating: searchParams.getAll('rating'),
    hasImage: searchParams.get('hasImage') || '',
    isOld: searchParams.get('isOld') || '',
  };

  useEffect(() => {
    const fetchPolishes = async () => {
      try {
        // Build the query string from currentFilters
        const params = new URLSearchParams();
        if (currentFilters.search) params.set('search', currentFilters.search);
        if (currentFilters.hasImage) params.set('hasImage', currentFilters.hasImage);

        const response = await fetch(`/api/polishes?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch polishes');
        const data = await response.json();
        setPolishes(data);
      } catch (error) {
        console.error('Error fetching polishes:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolishes();
  }, [searchParams]); // Add searchParams as a dependency

  if (isLoading) {
    return (
        <PageHeader title="Loading..." />
    );
  }

  if (error) {
    return (
        <PageHeader
          title="Error"
          description={error}
        />
    );
  }

  return (
    <>
      <PageHeader
        title="All Nail Polishes"
        description="Browse, filter, and sort below ⬇"
      />
      <NailPolishGrid
        polishes={polishes}
        brands={brands}
        colors={colors}
        finishes={finishes}
        currentFilters={currentFilters}
      />
    </>
  );
}
