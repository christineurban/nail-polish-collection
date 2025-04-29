'use client';

import { FilterSort } from '@/components/FilterSort';
import NailPolishCard from '@/components/NailPolishCard';
import styled from 'styled-components';

const StyledContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

interface Polish {
  id: string;
  brand: string;
  name: string;
  imageUrl: string | null;
  color: string;
  finishes: string[];
  rating: string | null;
  link: string | null;
}

interface PageClientProps {
  polishes: Polish[];
  brands: string[];
  finishes: string[];
  currentFilters: {
    brand: string;
    finish: string;
    search: string;
    sort: string;
  };
}

export default function PageClient({ polishes, brands, finishes, currentFilters }: PageClientProps) {
  return (
    <StyledContainer>
      <h1>My Nail Polish Collection</h1>

      <FilterSort
        brands={brands}
        finishes={finishes}
        currentFilters={currentFilters}
      />

      <StyledGrid>
        {polishes.map(polish => (
          <NailPolishCard
            key={polish.id}
            id={polish.id}
            brand={polish.brand}
            name={polish.name}
            imageUrl={polish.imageUrl}
            rating={polish.rating}
            finishes={polish.finishes}
            link={polish.link}
          />
        ))}
      </StyledGrid>
    </StyledContainer>
  );
}
