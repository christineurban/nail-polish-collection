'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ImageSelector } from '@/components/ImageSelector';
import styled from 'styled-components';

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

const StyledHeader = styled.div`
  margin-bottom: 2rem;

  h1 {
    margin: 0;
    margin-top: 1rem;
  }

  p {
    margin: 0;
    margin-top: 1rem;
  }
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

interface PageProps {
  params: {
    id: string;
  };
}

export default function SelectImagePage({ params }: PageProps) {
  const router = useRouter();
  const [polish, setPolish] = useState<Polish | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolish = async () => {
      try {
        const response = await fetch(`/api/polish/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch polish details');
        }
        const data = await response.json();

        if (!data.link) {
          throw new Error('This polish does not have a source link');
        }

        setPolish({
          id: data.id,
          name: data.name,
          link: data.link,
          imageUrl: data.image_url,
          brand: data.brand
        });
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolish();
  }, [params.id]);

  const handleImageSaved = () => {
    router.refresh();
    router.push(`/polish/${params.id}`);
  };

  if (isLoading) {
    return (
      <StyledContainer>
        <h1>Loading...</h1>
      </StyledContainer>
    );
  }

  if (error || !polish) {
    return (
      <StyledContainer>
        <StyledError>
          <h1>Error</h1>
          <p>{error || 'Failed to load polish details'}</p>
        </StyledError>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledBackButton
        onClick={() => router.push(`/polish/${params.id}`)}
        aria-label="Back to polish details"
      >
        Back to Details
      </StyledBackButton>
      <StyledHeader>
        <h1>Select Image</h1>
        <p>Click on an image to select it, then click "Save" to update the database.</p>
      </StyledHeader>
      <ImageSelector
        polish={polish}
        onImageSaved={handleImageSaved}
      />
    </StyledContainer>
  );
}
