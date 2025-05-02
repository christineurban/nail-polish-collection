'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  StyledContainer,
  StyledHeader,
  StyledGrid,
  StyledImageCard,
  StyledImage,
  StyledSelect,
  StyledButton,
  StyledDeleteButton,
  StyledSaveButton,
} from './page.styled';

interface Polish {
  id: string;
  name: string;
  brand_id: string;
  brands: {
    name: string;
  };
}

interface ImageItem {
  url: string;
  name: string;
  selectedPolishId?: string;
  markedForDeletion?: boolean;
}

export default function ImageManager() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [polishes, setPolishes] = useState<Polish[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchImages();
    fetchPolishes();
  }, []);

  const fetchImages = async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: files } = await supabase.storage
      .from('nail-polish-images')
      .list();

    if (files) {
      const imageItems: ImageItem[] = await Promise.all(
        files.map(async (file) => {
          const { data: { publicUrl } } = supabase.storage
            .from('nail-polish-images')
            .getPublicUrl(file.name);

          return {
            url: publicUrl,
            name: file.name
          };
        })
      );
      setImages(imageItems);
    }
  };

  const fetchPolishes = async () => {
    const response = await fetch('/api/polishes');
    const data = await response.json();
    setPolishes(data.polishes);
  };

  const handlePolishSelect = (imageIndex: number, polishId: string) => {
    setImages(prev => prev.map((img, idx) =>
      idx === imageIndex ? { ...img, selectedPolishId: polishId } : img
    ));
  };

  const toggleDeletion = (imageIndex: number) => {
    setImages(prev => prev.map((img, idx) =>
      idx === imageIndex ? { ...img, markedForDeletion: !img.markedForDeletion } : img
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Handle deletions
      const imagesToDelete = images.filter(img => img.markedForDeletion);
      const imagesToUpdate = images.filter(img => img.selectedPolishId && !img.markedForDeletion);

      // Delete marked images
      if (imagesToDelete.length > 0) {
        await fetch('/api/delete-bulk-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ images: imagesToDelete.map(img => img.name) })
        });
      }

      // Update polish image URLs
      if (imagesToUpdate.length > 0) {
        await fetch('/api/update-bulk-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            updates: imagesToUpdate.map(img => ({
              polishId: img.selectedPolishId,
              imageUrl: img.url
            }))
          })
        });
      }

      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <StyledContainer>
      <StyledHeader>
        <h1>Image Manager</h1>
        <StyledSaveButton
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save All Changes'}
        </StyledSaveButton>
      </StyledHeader>

      <StyledGrid>
        {images.map((image, index) => (
          <StyledImageCard
            key={image.name}
            $markedForDeletion={image.markedForDeletion}
          >
            <StyledImage src={image.url} alt={image.name} />
            <StyledSelect
              value={image.selectedPolishId || ''}
              onChange={(e) => handlePolishSelect(index, e.target.value)}
              disabled={image.markedForDeletion}
            >
              <option value="">Select a polish...</option>
              {polishes.map(polish => (
                <option key={polish.id} value={polish.id}>
                  {polish.brands.name} - {polish.name}
                </option>
              ))}
            </StyledSelect>
            <StyledDeleteButton
              onClick={() => toggleDeletion(index)}
              $active={image.markedForDeletion}
            >
              {image.markedForDeletion ? 'Unmark for Deletion' : 'Mark for Deletion'}
            </StyledDeleteButton>
          </StyledImageCard>
        ))}
      </StyledGrid>
    </StyledContainer>
  );
}
