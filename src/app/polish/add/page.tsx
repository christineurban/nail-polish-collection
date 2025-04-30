'use client';

import { useEffect, useState } from 'react';
import NailPolishForm from '@/components/NailPolishForm';
import { StyledContainer } from './page.styled';
import { PageHeader } from '@/components/PageHeader';

interface Options {
  brands: string[];
  colors: string[];
  finishes: string[];
}

export default function AddPolishPage() {
  const [options, setOptions] = useState<Options>({
    brands: [],
    colors: [],
    finishes: [],
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch('/api/options');
        const data = await response.json();
        setOptions(data);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  return (
    <StyledContainer>
      <PageHeader
        title="Add New Nail Polish"
      />
      <NailPolishForm
        brands={options.brands}
        availableColors={options.colors}
        availableFinishes={options.finishes}
      />
    </StyledContainer>
  );
}
