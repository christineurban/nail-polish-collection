'use client';

import { useState, useEffect } from 'react';
import { StyledContainer, StyledPolishCard, StyledImagesGrid, StyledImageContainer, StyledImage, StyledSaveButton, StyledMetadata, StyledNoImages } from './index.styled';
import { motion, AnimatePresence } from 'framer-motion';

interface Polish {
  id: string;
  name: string;
  link: string | null;
  image_url: string | null;
  brands: {
    name: string;
  };
}

interface ImageSelectorProps {
  polishes: Polish[];
}

export const ImageSelector = ({ polishes: initialPolishes }: ImageSelectorProps) => {
  const [selectedImages, setSelectedImages] = useState<Record<string, string>>({});
  const [polishImages, setPolishImages] = useState<Record<string, string[]>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [polishes, setPolishes] = useState<Polish[]>(
    initialPolishes.filter(polish => !polish.image_url)
  );
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});

  const handleImageSelect = (polishId: string, imageUrl: string) => {
    setSelectedImages(prev => ({
      ...prev,
      [polishId]: imageUrl
    }));
  };

  const handleSaveImage = async (polishId: string) => {
    const imageUrl = selectedImages[polishId];
    if (!imageUrl) return;

    try {
      setSavingStates(prev => ({ ...prev, [polishId]: true }));

      const response = await fetch('/api/update-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: polishId,
          imageUrl
        }),
      });

      if (response.ok) {
        // Wait for success animation to complete before removing
        setTimeout(() => {
          setPolishes(prev => prev.filter(p => p.id !== polishId));
        }, 1500);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save image');
      }
    } catch (error) {
      console.error('Error saving image:', error);
      setSavingStates(prev => ({ ...prev, [polishId]: false }));
    }
  };

  const fetchImagesForPolish = async (polish: Polish) => {
    if (!polish.link || polishImages[polish.id]) return;

    try {
      setLoadingStates(prev => ({ ...prev, [polish.id]: true }));
      const response = await fetch(`/api/fetch-images?url=${encodeURIComponent(polish.link!)}`);
      if (!response.ok) throw new Error('Failed to fetch images');

      const data = await response.json();
      setPolishImages(prev => ({
        ...prev,
        [polish.id]: data.images || []
      }));
    } catch (error) {
      console.error(`Error fetching images for ${polish.brands.name} - ${polish.name}:`, error);
      setPolishImages(prev => ({
        ...prev,
        [polish.id]: []
      }));
    } finally {
      setLoadingStates(prev => ({ ...prev, [polish.id]: false }));
    }
  };

  useEffect(() => {
    polishes.forEach(polish => {
      if (polish.link && !polishImages[polish.id]) {
        fetchImagesForPolish(polish);
      }
    });
  }, []);

  return (
    <StyledContainer>
      <h1>Nail Polish Images Selection</h1>
      <p>Click on an image to select it, then click "Save" to update the database.</p>

      <AnimatePresence>
        {polishes.map(polish => (
          <StyledPolishCard
            key={polish.id}
            initial={{ opacity: 1, scale: 1 }}
            animate={savingStates[polish.id] ? {
              opacity: 0.5,
              scale: 0.98,
              transition: { duration: 0.3 }
            } : {}}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: -20,
              transition: {
                duration: 0.4,
                ease: "easeOut"
              }
            }}
          >
            <StyledMetadata>
              <h2>{polish.brands.name} - {polish.name}</h2>
              <p>Source: <a href={polish.link || ''} target="_blank" rel="noopener noreferrer">
                {polish.link}
              </a></p>
            </StyledMetadata>

            {!polish.link ? (
              <StyledNoImages>No source link available</StyledNoImages>
            ) : loadingStates[polish.id] ? (
              <StyledNoImages>Loading images...</StyledNoImages>
            ) : polishImages[polish.id]?.length ? (
              <>
                <StyledSaveButton
                  onClick={() => handleSaveImage(polish.id)}
                  disabled={!selectedImages[polish.id]}
                >
                  Save Selected Image
                </StyledSaveButton>
                <StyledImagesGrid>
                  {polishImages[polish.id].map((img, index) => (
                    <StyledImageContainer key={index}>
                      <StyledImage
                        src={img}
                        alt={`${polish.brands.name} ${polish.name} - Image ${index + 1}`}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                        onClick={() => handleImageSelect(polish.id, img)}
                        $isSelected={selectedImages[polish.id] === img}
                      />
                    </StyledImageContainer>
                  ))}
                </StyledImagesGrid>
              </>
            ) : (
              <StyledNoImages>No images found on the linked page</StyledNoImages>
            )}
          </StyledPolishCard>
        ))}
      </AnimatePresence>
    </StyledContainer>
  );
};
