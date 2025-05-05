'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Rating } from '@prisma/client';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import {
  StyledContainer,
  StyledDetails,
  StyledImageContainer,
  StyledImageActions,
  StyledDetailsContent,
  StyledDisabledMessage
} from './index.styled';
import { useRouter, useSearchParams } from 'next/navigation';

interface Polish {
  id: string;
  brand: string;
  name: string;
  imageUrl: string | null;
  colors: string[];
  finishes: string[];
  rating: Rating | null;
  link: string | null;
  coats: number | null;
  notes: string | null;
  isOld: boolean | null;
  lastUsed: Date | null;
  totalBottles: number | null;
  emptyBottles: number | null;
}

interface NailPolishDetailsProps {
  polish: Polish;
}

export const NailPolishDetails = ({ polish }: NailPolishDetailsProps) => {
  const [isRemovingImage, setIsRemovingImage] = useState(false);
  const [isMarkingNoImage, setIsMarkingNoImage] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  const formatRating = (rating: Rating | null): string => {
    if (!rating) return 'Not Rated';
    return rating.replace('_PLUS', '+').replace('_MINUS', '-');
  };

  const handleRemoveImage = async () => {
    try {
      setIsRemovingImage(true);
      const response = await fetch('/api/remove-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: polish.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove image');
      }

      window.location.reload();
    } catch (error) {
      console.error('Error removing image:', error);
      alert('Failed to remove image. Please try again.');
    } finally {
      setIsRemovingImage(false);
    }
  };

  const handleMarkNoImage = async () => {
    try {
      setIsMarkingNoImage(true);
      const response = await fetch('/api/update-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: polish.id,
          imageUrl: 'n/a'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark as no image available');
      }

      window.location.reload();
    } catch (error) {
      console.error('Error marking as no image available:', error);
      alert('Failed to mark as no image available. Please try again.');
    } finally {
      setIsMarkingNoImage(false);
    }
  };

  return (
    <StyledContainer>
      <PageHeader
        title={`${polish.brand} - ${polish.name}`}
      />
      <StyledDetails>
        <div>
          <StyledImageContainer>
            {polish.imageUrl && polish.imageUrl !== 'n/a' ? (
              <Image
                src={polish.imageUrl}
                alt={`${polish.brand} - ${polish.name}`}
                fill
                priority
              />
            ) : polish.imageUrl === 'n/a' ? (
              <p>No image available for this polish</p>
            ) : (
              <p>No image available</p>
            )}
          </StyledImageContainer>
          <StyledImageActions>
            {polish.imageUrl !== 'n/a' && (
              <Button
                onClick={() => router.push(`/polish/${polish.id}/select-image`)}
              >
                {polish.imageUrl ? 'Change Image' : 'Add Image'}
              </Button>
            )}
            {polish.imageUrl && polish.imageUrl !== 'n/a' && (
              <Button
                onClick={handleRemoveImage}
                disabled={isRemovingImage}
                $variant="danger"
              >
                Remove Image
              </Button>
            )}
            {!polish.imageUrl && (
              <Button
                onClick={handleMarkNoImage}
                disabled={isMarkingNoImage}
                $variant="secondary"
              >
                Mark as No Image Available
              </Button>
            )}
            {polish.imageUrl === 'n/a' && (
              <Button
                onClick={() => router.push(`/polish/${polish.id}/select-image`)}
                $variant="secondary"
              >
                Add Image
              </Button>
            )}
          </StyledImageActions>
        </div>
        <StyledDetailsContent>
          <h2>Details</h2>
          <p>
            <strong>Link</strong>
            {polish.link ? (
              <Link href={polish.link} target="_blank" rel="noopener noreferrer">
                {polish.link}
              </Link>
            ) : '-'}
          </p>
          <p><strong>Colors</strong>{polish.colors.length > 0 ? polish.colors.join(', ') : '-'}</p>
          <p><strong>Finishes</strong>{polish.finishes.length > 0 ? polish.finishes.join(', ') : '-'}</p>
          <p><strong>Rating</strong>{polish.rating ? formatRating(polish.rating) : '-'}</p>
          <p><strong>Coats Needed</strong>{polish.coats || '-'}</p>
          <p><strong>Total Bottles</strong>{polish.totalBottles ?? '-'}</p>
          <p><strong>Empty Bottles</strong>{polish.emptyBottles ?? '-'}</p>
          <p><strong>Is Old</strong>{polish.isOld === null ? '-' : polish.isOld ? 'Yes' : 'No'}</p>
          <p><strong>Last Used</strong>{polish.lastUsed ? new Date(polish.lastUsed).toLocaleDateString() : '-'}</p>
          <p><strong>Notes</strong>{polish.notes || '-'}</p>
          <Button onClick={() => router.push(`/polish/${polish.id}/edit?returnTo=${returnTo || `/polish/${polish.id}`}`)} $fullWidth>
            Edit Polish
          </Button>
        </StyledDetailsContent>
      </StyledDetails>
    </StyledContainer>
  );
};
