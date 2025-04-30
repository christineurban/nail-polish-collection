'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StyledContainer } from './page.styled';
import { PageHeader } from '@/components/PageHeader';
import { NailPolishGrid } from '@/components/NailPolishGrid';
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
  const [polishes, setPolishes] = useState<Polish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        title="My Nail Polish Collection"
        description="Browse and manage your nail polish collection"
      />
      <FilterSort polishes={polishes} />
      <NailPolishGrid polishes={polishes} />
    </StyledContainer>
  );
}
