'use client';

import { useState, useEffect } from 'react';
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
  StyledPolishLink,
} from './index.styled';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/Button';
import { ImagePasteZone } from './ImagePasteZone';

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
  const [isCollapsed, setIsCollapsed] = useState(false);

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
          }, 1500);
        } else {
          setTimeout(() => {
            setIsSuccess(false);
          }, 1500);
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
    if (!polish.link) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/fetch-images?url=${encodeURIComponent(polish.link)}`);
      if (!response.ok) throw new Error('Failed to fetch images');

      const data = await response.json();
      console.log('Fetched images:', {
        totalImages: data.images?.length,
        debugInfo: data.debug,
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
    if (polish?.link) {
      fetchImages();
    }
  }, [polish]);

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
              <StyledPolishLink href={`/polish/${polish.id}`}>
                <h3>{polish.brand} - {polish.name}</h3>
              </StyledPolishLink>
              <StyledCollapseText onClick={handleCollapse}>
                {isCollapsed ? 'Show Images' : 'Hide Images'}
              </StyledCollapseText>
            </div>
            {polish.link ? (
              <div>
                <p>
                  Link: <a href={polish.link} target="_blank" rel="noopener noreferrer">
                    {polish.link}
                  </a>
                </p>
                  <a href={`/polish/${polish.id}/edit?returnTo=/image-selection`}>Edit link</a>
              </div>
            ) : (
              <p>No source link available. <a href={`/polish/${polish.id}/edit?returnTo=/image-selection`}>Add a link</a></p>
            )}
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

              {!polish.link ? (
                <></>
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
                  <StyledImagesGrid>
                    {images.map((img, index) => (
                      <StyledImageContainer key={index}>
                        <StyledImage
                          src={img}
                          alt={`${polish.brand} - ${polish.name} - Image ${index + 1}`}
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
            </>
          )}

          <AnimatePresence>
            {isSuccess && (
              <StyledSuccessOverlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StyledSuccessMessage
                  as={motion.div}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    transition: {
                      duration: 0.5,
                      ease: "easeOut"
                    }
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                >
                  {successMessage}
                </StyledSuccessMessage>
              </StyledSuccessOverlay>
            )}
          </AnimatePresence>
        </StyledPolishCard>
      </StyledContainer>
    </AnimatePresence>
  );
};
