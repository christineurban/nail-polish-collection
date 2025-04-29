'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NailPolishCard } from '@/components/NailPolishCard';
import { useRouter } from 'next/navigation';
import { Rating } from '@prisma/client';

const StyledContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const StyledHeader = styled.div`
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: #2D3748;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: #718096;
    font-size: 1.125rem;
    margin: 0;
  }
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

export default function SelectImages() {
  const router = useRouter();
  const [polishes, setPolishes] = useState<Polish[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPolishes = async () => {
      try {
        const response = await fetch('/api/polishes?hasImage=false');
        if (!response.ok) throw new Error('Failed to fetch polishes');
        const data = await response.json();
        setPolishes(data);
      } catch (error) {
        console.error('Error fetching polishes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolishes();
  }, []);

  const handleImageSelected = (polishId: string) => {
    router.push(`/polish/${polishId}/select-image`);
  };

  if (isLoading) {
    return (
      <StyledContainer>
        <StyledHeader>
          <h1>Loading...</h1>
        </StyledHeader>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledHeader>
        <h1>Select Missing Images</h1>
        <p>Choose images for polishes that don't have one yet</p>
      </StyledHeader>
      <StyledGrid>
        {polishes.length > 0 ? (
          polishes.map((polish) => (
            <NailPolishCard
              key={polish.id}
              id={polish.id}
              brand={polish.brand}
              name={polish.name}
              imageUrl={polish.imageUrl}
              colors={polish.colors}
              finishes={polish.finishes}
              rating={polish.rating}
              onChooseImage={handleImageSelected}
            />
          ))
        ) : (
          <StyledEmptyState>
            <h2>All Set!</h2>
            <p>All polishes in your collection have images.</p>
          </StyledEmptyState>
        )}
      </StyledGrid>
    </StyledContainer>
  );
}
