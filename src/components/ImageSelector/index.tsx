'use client';

import { useState, useEffect } from 'react';
import {
  StyledPolishCard,
  StyledImagesGrid,
  StyledImageContainer,
  StyledImage,
  StyledSaveButton,
  StyledRemoveButton,
  StyledMetadata,
  StyledNoImages,
  StyledLoadingOverlay,
  StyledSpinner,
  StyledSuccessMessage
} from './index.styled';
import { motion, AnimatePresence } from 'framer-motion';

interface Polish {
  id: string;
  name: string;
  link: string | null;
  imageUrl: string | null;
  brand: string;
}

interface ImageSelectorProps {
  polish: Polish;
  onImageSaved?: () => void;
}

export const ImageSelector = ({ polish, onImageSaved }: ImageSelectorProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleRemoveImage = async () => {
    try {
      setIsRemoving(true);

      const response = await fetch('/api/remove-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: polish.id
        }),
      });

      if (response.ok) {
        setSuccessMessage('Image removed successfully!');
        setIsSuccess(true);
        if (onImageSaved) {
          setTimeout(() => {
            onImageSaved();
          }, 1000);
        } else {
          setTimeout(() => {
            setIsSuccess(false);
          }, 2000);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove image');
      }
    } catch (error) {
      console.error('Error removing image:', error);
    } finally {
      setIsRemoving(false);
    }
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
          }, 1000);
        } else {
          setTimeout(() => {
            setIsSuccess(false);
          }, 2000);
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
    if (!polish.link) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/fetch-images?url=${encodeURIComponent(polish.link)}`);
      if (!response.ok) throw new Error('Failed to fetch images');

      const data = await response.json();
      setImages(data.images || []);
    } catch (error) {
      console.error(`Error fetching images for ${polish.brand} - ${polish.name}:`, error);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (polish?.link) {
      fetchImages();
    }
  }, [polish]);

  if (!polish) {
    return null;
  }

  return (
    <StyledPolishCard>
      <StyledMetadata>
        <h2>{polish.brand} - {polish.name}</h2>
        {polish.link ? (
          <p>Source: <a href={polish.link} target="_blank" rel="noopener noreferrer">
            {polish.link}
          </a></p>
        ) : (
          <p>No source link available</p>
        )}
      </StyledMetadata>

      {polish.imageUrl && (
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h3>Current Image</h3>
          <StyledImage
            src={polish.imageUrl}
            alt={`Current image for ${polish.brand} ${polish.name}`}
            style={{ maxWidth: '300px', margin: '0 auto' }}
          />
        </div>
      )}

      {!polish.link ? (
        <StyledNoImages>No source link available</StyledNoImages>
      ) : isLoading ? (
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
        <StyledNoImages>No images found on the linked page</StyledNoImages>
      ) : (
        <>
          {polish.imageUrl && onImageSaved && (
            <StyledRemoveButton
              onClick={handleRemoveImage}
              disabled={isRemoving}
              $hasSelectedImage={!!selectedImage}
            >
              {isRemoving ? 'Removing...' : 'Remove Current Image'}
            </StyledRemoveButton>
          )}
          <StyledSaveButton
            onClick={handleSaveImage}
            disabled={!selectedImage || isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Selected Image'}
          </StyledSaveButton>
          <StyledImagesGrid>
            {images.map((img, index) => (
              <StyledImageContainer key={index}>
                <StyledImage
                  src={img}
                  alt={`${polish.brand} ${polish.name} - Image ${index + 1}`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                  onClick={() => handleImageSelect(img)}
                  $isSelected={selectedImage === img}
                />
              </StyledImageContainer>
            ))}
          </StyledImagesGrid>
        </>
      )}

      <AnimatePresence>
        {isSuccess && (
          <StyledSuccessMessage
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {successMessage}
          </StyledSuccessMessage>
        )}
      </AnimatePresence>
    </StyledPolishCard>
  );
};
