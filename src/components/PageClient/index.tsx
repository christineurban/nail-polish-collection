'use client';

import { FilterSort } from '@/components/FilterSort';
import { NailPolishCard } from '@/components/NailPolishCard';
import styled from 'styled-components';
import { Rating } from '@prisma/client';
import { useState } from 'react';

const StyledContainer = styled.main`
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

interface PageClientProps {
  polishes: Polish[];
  brands: string[];
  finishes: string[];
  colors: string[];
  currentFilters: {
    brand: string[];
    finish: string[];
    color: string[];
    search: string;
    sort: string;
    rating: string[];
    hasImage: string;
  };
}

export const PageClient = ({
  polishes,
  brands,
  finishes,
  colors,
  currentFilters,
}: PageClientProps) => {
  const [filters, setFilters] = useState({
    brand: currentFilters.brand || [],
    finish: currentFilters.finish || [],
    color: currentFilters.color || [],
    search: currentFilters.search || '',
    sort: currentFilters.sort || '',
    rating: currentFilters.rating || [],
    hasImage: currentFilters.hasImage || ''
  });

  return (
    <StyledContainer>
      <FilterSort
        brands={brands}
        finishes={finishes}
        colors={colors}
        currentFilters={currentFilters}
      />
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
            />
          ))
        ) : (
          <StyledEmptyState>
            <h2>No Polishes Found</h2>
            <p>Try adjusting your filters to find what you're looking for.</p>
          </StyledEmptyState>
        )}
      </StyledGrid>
    </StyledContainer>
  );
};

export default PageClient;
