'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { StyledContainer } from './page.styled';
import { PageHeader } from '@/components/PageHeader';
import { PolishCollection } from '@/components/PolishCollection';
import { FilterSort } from '@/components/FilterSort';
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
  };

  useEffect(() => {
    const fetchPolishes = async () => {
      try {
        const response = await fetch('/api/polishes');
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
  }, []);

  if (isLoading) {
    return (
      <StyledContainer>
        <PageHeader title="Loading..." />
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer>
        <PageHeader
          title="Error"
          description={error}
        />
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <PageHeader
        title="Nail Polish Collection"
        description="Browse and manage your nail polish collection"
      />
      <PolishCollection
        polishes={polishes}
        brands={brands}
        colors={colors}
        finishes={finishes}
        currentFilters={currentFilters}
      />
    </StyledContainer>
  );
}
