'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import type { DefaultTheme } from 'styled-components';

interface SelectImageClientProps {
  id: string;
  name: string;
  brand: string;
  link: string;
}

const StyledButton = styled.button<{ $disabled?: boolean; theme: DefaultTheme }>`
  background: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.text.muted : theme.colors.background.gradient};
  color: ${({ theme }) => theme.colors.text.inverse};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: all ${({ theme }) => theme.transitions.base};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  backdrop-filter: blur(8px);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const StyledContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
  position: relative;
`;

const StyledHeader = styled.div`
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  padding-right: 150px; /* Make room for the save button */

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    margin: 0;
  }

  p {
    color: ${({ theme }) => theme.colors.text.secondary};
    margin: 0;
  }
`;

const StyledBackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.text.primary};
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  padding: 0;
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.base};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }

  &:focus {
    outline: none;
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const StyledImagesGrid = styled.div<{ theme: DefaultTheme }>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const StyledImageContainer = styled.div<{ $isSelected: boolean; theme: DefaultTheme }>`
  position: relative;
  padding-bottom: 100%;
  cursor: pointer;
  border: 2px solid ${props => props.$isSelected ? props.theme.colors.primary : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  transition: transform ${({ theme }) => theme.transitions.base},
              border-color ${({ theme }) => theme.transitions.base};

  &:hover {
    transform: scale(1.02);
    border-color: ${({ theme, $isSelected }) =>
      $isSelected ? theme.colors.primary : theme.colors.primary + '80'};
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  ${StyledButton} {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 10;
    padding: 0.5rem 1rem;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;

const StyledActions = styled.div`
  position: absolute;
  top: 2rem;
  right: 2rem;
  z-index: 10;
`;

export default function SelectImageClient({ id, name, brand, link }: SelectImageClientProps) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`/api/fetch-images?url=${encodeURIComponent(link)}`);
        if (!response.ok) throw new Error('Failed to fetch images');

        const data = await response.json();
        setImages(data.images || []);
      } catch (err) {
        setError('Failed to load images. Please try again.');
        console.error('Error fetching images:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [link]);

  const handleSaveImage = async () => {
    if (!selectedImage) return;

    try {
      const response = await fetch('/api/update-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          imageUrl: selectedImage,
        }),
      });

      if (!response.ok) throw new Error('Failed to save image');

      router.push(`/polish/${id}`);
    } catch (err) {
      setError('Failed to save image. Please try again.');
      console.error('Error saving image:', err);
    }
  };

  const handleBack = () => {
    router.push(`/polish/${id}`);
  };

  if (isLoading) {
    return (
      <StyledContainer>
        <StyledHeader>
          <StyledBackButton onClick={handleBack}>← Back to Details</StyledBackButton>
          <h1>Loading images...</h1>
        </StyledHeader>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer>
        <StyledHeader>
          <StyledBackButton onClick={handleBack}>← Back to Details</StyledBackButton>
          <h1>Error</h1>
          <p>{error}</p>
        </StyledHeader>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledActions>
        <StyledButton
          onClick={handleSaveImage}
          $disabled={!selectedImage}
          disabled={!selectedImage}
        >
          Save Selected Image
        </StyledButton>
      </StyledActions>

      <StyledHeader>
        <StyledBackButton onClick={handleBack}>← Back to Details</StyledBackButton>
        <h1>Select an Image for {brand} {name}</h1>
        <p>Click on an image to select it</p>
      </StyledHeader>

      <StyledImagesGrid>
        {images.map((imageUrl, index) => (
          <StyledImageContainer
            key={`${imageUrl}-${index}`}
            onClick={() => setSelectedImage(imageUrl)}
            $isSelected={selectedImage === imageUrl}
          >
            <img
              src={imageUrl}
              alt={`${brand} ${name} - Image ${index + 1}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </StyledImageContainer>
        ))}
      </StyledImagesGrid>
    </StyledContainer>
  );
}
