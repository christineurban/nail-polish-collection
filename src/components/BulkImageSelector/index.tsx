'use client';

import React, { useState, useEffect } from 'react';
import {
  StyledContainer,
  StyledPolishCard,
  StyledImagesGrid,
  StyledImageContainer,
  StyledImage,
  StyledMetadata,
  StyledNoImages,
  StyledLoadingOverlay,
  StyledSpinner,
  StyledSuccessMessage,
  StyledSuccessOverlay,
  StyledCollapseText,
  StyledImageCount,
} from './index.styled';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/Button';
import { ImagePasteZone } from '@/components/ImageSelector/ImagePasteZone';

interface Polish {
  id: string;
  name: string;
  imageUrl: string | null;
  brand: string;
}

interface BulkImageSelectorProps {
  polish: Polish;
  googleSheetUrls: string[];
  onImageSaved?: () => void;
}

export const BulkImageSelector = ({ polish, googleSheetUrls, onImageSaved }: BulkImageSelectorProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleSaveImage = async () => {
    if (!selectedImage) return;

    try {
      setIsSaving(true);

      const response = await fetch('/api/update-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: polish.id,
          imageUrl: selectedImage
        }),
      });

      if (response.ok) {
        setSuccessMessage('Image saved successfully!');
        setIsSuccess(true);
        if (onImageSaved) {
          setTimeout(() => {
            onImageSaved();
          }, 1500);
        } else {
          setTimeout(() => {
            setIsSuccess(false);
          }, 1500);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save image');
      }
    } catch (error) {
      console.error('Error saving image:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const fetchImages = async () => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/fetch-bulk-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urls: googleSheetUrls
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch images');

      const data = await response.json();
      console.log('Fetched images:', {
        totalUrls: data.debug?.totalUrls,
        uniqueImagesFound: data.debug?.uniqueImagesFound,
        images: data.images
      });
      setImages(data.images || []);
    } catch (error) {
      console.error(`Error fetching images for ${polish.brand} - ${polish.name}:`, error);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handlePastedImage = (imageUrl: string) => {
    setImages(prevImages => [imageUrl, ...prevImages]);
    setSelectedImage(imageUrl);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  if (!polish) {
    return null;
  }

  return (
    <AnimatePresence>
      <StyledContainer
        as={motion.div}
        initial={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StyledPolishCard>
          <StyledMetadata>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>{polish.brand} - {polish.name}</h3>
              <StyledCollapseText onClick={handleCollapse}>
                {isCollapsed ? 'Show Images' : 'Hide Images'}
              </StyledCollapseText>
            </div>
          </StyledMetadata>

          <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <Button
              onClick={handleSaveImage}
              disabled={!selectedImage || isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Image'}
            </Button>
            {!isLoading && images.length > 0 && (
              <StyledImageCount>
                {images.length} image{images.length !== 1 ? 's' : ''} found
              </StyledImageCount>
            )}
          </div>

          {!isCollapsed && (
            <>
              {polish.imageUrl && (
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                  <h3>Current Image</h3>
                  <StyledImage
                    src={polish.imageUrl}
                    alt={`Current image for ${polish.brand} - ${polish.name}`}
                    style={{ maxWidth: '300px', margin: '0 auto' }}
                  />
                </div>
              )}

              <ImagePasteZone onImagePasted={handlePastedImage} />

              {isLoading ? (
                <StyledLoadingOverlay>
                  <StyledSpinner
                    as={motion.div}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  <p>Loading images...</p>
                </StyledLoadingOverlay>
              ) : images.length === 0 ? (
                <StyledNoImages>No images found in the Google Sheets</StyledNoImages>
              ) : (
                <StyledImagesGrid>
                  {images.map((img, index) => (
                    <StyledImageContainer key={index}>
                      <StyledImage
                        src={img}
                        alt={`${polish.brand} - ${polish.name} - Image ${index + 1}`}
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                        onClick={() => handleImageSelect(img)}
                        $isSelected={selectedImage === img}
                      />
                    </StyledImageContainer>
                  ))}
                </StyledImagesGrid>
              )}
            </>
          )}

          {isSuccess && (
            <StyledSuccessOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <StyledSuccessMessage>{successMessage}</StyledSuccessMessage>
            </StyledSuccessOverlay>
          )}
        </StyledPolishCard>
      </StyledContainer>
    </AnimatePresence>
  );
};
