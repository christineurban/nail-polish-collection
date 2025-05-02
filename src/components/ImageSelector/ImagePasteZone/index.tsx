'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaPaste } from 'react-icons/fa';
import {
  StyledPasteZone,
  StyledPasteContent,
  StyledPasteIcon,
  StyledPasteText,
  StyledPasteSubtext,
  StyledLoadingOverlay,
  StyledErrorMessage,
} from './index.styled';

interface ImagePasteZoneProps {
  onImagePasted: (imageUrl: string) => void;
}

export const ImagePasteZone = ({ onImagePasted }: ImagePasteZoneProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePaste = useCallback(async (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    setError(null);

    const imageItem = Array.from(items).find(
      item => item.type.indexOf('image') !== -1
    );

    if (!imageItem) {
      setError('No image found in clipboard');
      return;
    }

    try {
      setIsLoading(true);
      const blob = imageItem.getAsFile();
      if (!blob) {
        throw new Error('Failed to get image from clipboard');
      }

      // Convert blob to base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64data = reader.result as string;
        onImagePasted(base64data);
        setIsLoading(false);
      };
      reader.onerror = () => {
        throw new Error('Failed to read image data');
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process pasted image');
      setIsLoading(false);
    }
  }, [onImagePasted]);

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  return (
    <StyledPasteZone onClick={() => setError(null)}>
      <StyledPasteContent>
        <StyledPasteIcon>
          <FaPaste />
        </StyledPasteIcon>
        <StyledPasteText>
          Paste image here
        </StyledPasteText>
        <StyledPasteSubtext>
          or press Ctrl/Cmd + V anywhere
        </StyledPasteSubtext>
        {error && <StyledErrorMessage>{error}</StyledErrorMessage>}
      </StyledPasteContent>
      {isLoading && (
        <StyledLoadingOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          Processing image...
        </StyledLoadingOverlay>
      )}
    </StyledPasteZone>
  );
};
