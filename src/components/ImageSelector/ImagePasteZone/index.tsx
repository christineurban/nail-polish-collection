'use client';

import { useState, useEffect, useCallback, useRef, ClipboardEvent } from 'react';
import { FaPaste } from 'react-icons/fa';
import {
  StyledPasteZone,
  StyledPasteContent,
  StyledPasteIcon,
  StyledPasteText,
  StyledPasteSubtext,
  StyledLoadingOverlay,
  StyledErrorMessage,
  StyledTextarea,
} from './index.styled';

interface ImagePasteZoneProps {
  onImagePasted: (imageUrl: string) => void;
}

export const ImagePasteZone = ({ onImagePasted }: ImagePasteZoneProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Check if the device is mobile
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePaste = useCallback(async (event: ClipboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    const items = event.clipboardData?.items;
    if (!items) return;

    setError(null);

    // Try to find any image content in the clipboard
    let imageItem = null;

    // First try: Look for direct image type
    imageItem = Array.from(items).find(
      item => item.type.indexOf('image') !== -1
    );

    // Second try: Look for other formats that might contain images
    if (!imageItem) {
      for (const item of Array.from(items)) {
        // Check for content types that might contain images
        if (
          item.type === 'text/html' ||
          item.type === 'text/rtf' ||
          item.type === 'application/x-vnd.google-sheets-html'
        ) {
          // Get the content as a string
          const content = await new Promise<string>((resolve) => {
            item.getAsString((s: string) => resolve(s));
          });

          // Try to find an image in the HTML content
          const imgMatch = content.match(/<img[^>]+src="([^">]+)"/i);
          if (imgMatch && imgMatch[1]) {
            // Create a new blob from the image URL
            try {
              const response = await fetch(imgMatch[1]);
              const blob = await response.blob();
              imageItem = {
                type: blob.type,
                getAsFile: () => new File([blob], 'pasted-image.jpg', { type: blob.type })
              };
              break;
            } catch (err) {
              console.error('Failed to fetch image from HTML content:', err);
            }
          }
        }
      }
    }

    if (!imageItem) {
      setError('No image found in clipboard. Try copying the image directly rather than the cell.');
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
        // Clear the textarea after successful paste
        if (textareaRef.current) {
          textareaRef.current.value = '';
        }
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

  const handleClick = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <StyledPasteZone
      onClick={handleClick}
      role="button"
      aria-label="Paste image zone"
    >
      <StyledTextarea
        ref={textareaRef}
        onPaste={handlePaste}
        placeholder="Paste image here"
        aria-label="Paste image input"
      />
      <StyledPasteContent>
        <StyledPasteIcon>
          <FaPaste />
        </StyledPasteIcon>
        <StyledPasteText>
          {isMobile ? 'Tap to paste image' : 'Paste image here'}
        </StyledPasteText>
        <StyledPasteSubtext>
          {isMobile
            ? 'Tap and paste from your clipboard'
            : 'or press Ctrl/Cmd + V while hovering'}
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
