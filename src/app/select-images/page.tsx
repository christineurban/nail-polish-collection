'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NailPolishCard } from '@/components/NailPolishCard';
import { useRouter } from 'next/navigation';
import { Rating } from '@prisma/client';
import { PageHeader } from '@/components/PageHeader';

const StyledContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
`;

const StyledEmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  grid-column: 1 / -1;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 1rem;
  }

  p {
    color: #4a5568;
    margin-bottom: 2rem;
  }
`;

interface Polish {
  id: string;
  brand: string;
  name: string;
  imageUrl: string | null;
  colors: string[];
  finishes: string[];
  rating: Rating | null;
}

export default function SelectImagesPage() {
  const router = useRouter();
  const [polishes, setPolishes] = useState<Polish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolishes = async () => {
      try {
        const response = await fetch('/api/polishes?hasImage=false');
        if (!response.ok) throw new Error('Failed to fetch polish details');
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

  if (polishes.length === 0) {
    return (
      <StyledContainer>
        <PageHeader
          title="No Polishes Need Images"
          description="All polishes in your collection have images."
        />
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <PageHeader
        title="Select Images"
        description="Click on an image to select it, then click 'Save' to update the database."
      />
      <StyledGrid>
        {polishes.map(polish => (
          <NailPolishCard
            key={polish.id}
            id={polish.id}
            brand={polish.brand}
            name={polish.name}
            imageUrl={polish.imageUrl || undefined}
            colors={polish.colors}
            finishes={polish.finishes}
            rating={polish.rating || undefined}
            onChooseImage={() => router.push(`/polish/${polish.id}/select-image`)}
          />
        ))}
      </StyledGrid>
    </StyledContainer>
  );
}
