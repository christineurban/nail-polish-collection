'use client';

import React from 'react';
import Link from 'next/link';
import { StyledContainer, StyledHeader, StyledGrid } from './page.styled';
import NailPolishCard from '../components/NailPolishCard';
import Button from '../components/Button';
import { NailPolish } from '../types/nailPolish';

interface PageClientProps {
  polishes: Array<{
    id: string;
    imageUrl: string | null;
    brand: string;
    name: string;
    color: string;
    finishes: string;
    rating: string | null;
    link: string | null;
  }>;
}

const PageClient: React.FC<PageClientProps> = ({ polishes }) => {
  const transformedPolishes: NailPolish[] = polishes.map(polish => ({
    ...polish,
    finishes: polish.finishes.split(',').map(f => f.trim()),
    rating: polish.rating as NailPolish['rating']
  }));

  return (
    <StyledContainer>
      <StyledHeader>
        <h1>My Nail Polish Collection</h1>
        <Link href="/polish/new">
          <Button>Add New Polish</Button>
        </Link>
      </StyledHeader>

      <StyledGrid>
        {transformedPolishes.map((polish) => (
          <NailPolishCard
            key={polish.id}
            id={polish.id}
            imageUrl={polish.imageUrl}
            brand={polish.brand}
            name={polish.name}
            finishes={polish.finishes}
            rating={polish.rating}
            link={polish.link}
          />
        ))}
      </StyledGrid>
    </StyledContainer>
  );
};

export default PageClient;
