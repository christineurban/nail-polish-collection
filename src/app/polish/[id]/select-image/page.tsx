'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ImageSelector } from '@/components/ImageSelector';
import styled from 'styled-components';
import { PageHeader } from '@/components/PageHeader';

const StyledContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const StyledError = styled.div`
  color: #e53e3e;
  text-align: center;
  padding: 2rem;
`;

const StyledBackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  padding: 0;
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.base};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[700]};
  }

  &:focus {
    outline: none;
    color: ${({ theme }) => theme.colors.primary[700]};
  }

  &::before {
    content: '←';
    font-size: 1.2em;
  }
`;

interface Polish {
  id: string;
  name: string;
  link: string | null;
  imageUrl: string | null;
  brand: string;
}

export default function SelectImagePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [polish, setPolish] = useState<Polish | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolish = async () => {
      try {
        const response = await fetch(`/api/polishes/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch polish details');
        const data = await response.json();
        setPolish(data);
      } catch (error) {
        console.error('Error fetching polish:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolish();
  }, [params.id]);

  const handleBack = () => {
    router.back();
  };

  const handleImageSaved = () => {
    router.push(`/polish/${params.id}`);
  };

  if (isLoading) {
    return (
      <StyledContainer>
        <PageHeader title="Loading..." />
      </StyledContainer>
    );
  }

  if (error || !polish) {
    return (
      <StyledContainer>
        <PageHeader
          title="Error"
          description={error || 'Polish not found'}
        />
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledBackButton onClick={handleBack}>Back</StyledBackButton>
      <PageHeader
        title={`Select Image for ${polish.brand} - ${polish.name}`}
        description="Search and select an image for your nail polish"
      />
      <ImageSelector
        polish={polish}
        onImageSaved={handleImageSaved}
      />
    </StyledContainer>
  );
}
