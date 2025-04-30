'use client';

import { FilterSort } from '@/components/FilterSort';
import { NailPolishCard } from '@/components/NailPolishCard';
import { Rating } from '@prisma/client';
import { useRouter } from 'next/navigation';
import {
  StyledGrid,
  StyledEmptyState,
} from './index.styled';

interface Polish {
  id: string;
  brand: string;
  name: string;
  imageUrl: string | null;
  colors: string[];
  finishes: string[];
  rating: Rating | null;
}

interface PolishCollectionProps {
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

export const PolishCollection = ({
  polishes,
  brands,
  finishes,
  colors,
  currentFilters,
}: PolishCollectionProps) => {
  const router = useRouter();

  const handleChooseImage = (id: string) => {
    router.push(`/polish/${id}/select-image`);
  };

  return (
    <>
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
              imageUrl={polish.imageUrl || undefined}
              colors={polish.colors}
              finishes={polish.finishes}
              rating={polish.rating || undefined}
              onChooseImage={handleChooseImage}
            />
          ))
        ) : (
          <StyledEmptyState>
            <h2>No Polishes Found</h2>
            <p>Try adjusting your filters to find what you're looking for.</p>
          </StyledEmptyState>
        )}
      </StyledGrid>
    </>
  );
};
