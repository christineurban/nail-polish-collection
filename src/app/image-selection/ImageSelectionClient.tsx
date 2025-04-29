'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
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

interface ImageSelectionClientProps {
  polishes: Polish[];
}

const StyledContainer = styled.div`
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const StyledPolishCard = styled(motion.div)`
  border: 1px solid #ccc;
  margin: 20px 0;
  padding: 20px;
  border-radius: 8px;
  position: relative;
`;

const StyledImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 20px;
`;

const StyledImageContainer = styled.div`
  position: relative;
`;

const StyledImage = styled.img<{ $isSelected?: boolean }>`
  max-width: 100%;
  height: auto;
  border: 1px solid #eee;
  ${props => props.$isSelected && `
    border: 3px solid #4CAF50;
  `}
`;

const StyledSaveButton = styled.button`
  background: #2196F3;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 5;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const StyledMetadata = styled.div`
  margin-bottom: 10px;
  padding-right: 150px; /* Make room for the save button */
`;

const StyledNoImages = styled.p`
  color: red;
`;

export default function ImageSelectionClient({ polishes: initialPolishes }: ImageSelectionClientProps) {
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
}
