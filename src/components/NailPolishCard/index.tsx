'use client';

import React, { FC } from 'react';
import { useRouter } from 'next/navigation';
import {
  StyledCard,
  StyledContent,
  StyledImageContainer,
  StyledBrand,
  StyledTitle,
  StyledRating,
  StyledMetadata,
  StyledFinishes,
  StyledTag,
  StyledImage,
  StyledColorChip,
  StyledColorPreview,
  StyledChooseImageButton,
  StyledClickableArea,
} from './index.styled';
import { Rating } from '@prisma/client';

const formatRating = (rating: Rating): string => {
  return rating.replace('_PLUS', '+').replace('_MINUS', '-');
};

interface NailPolishCardProps {
  id: string;
  brand: string;
  name: string;
  imageUrl: string | null;
  colors?: string[];
  finishes?: string[];
  rating?: Rating;
  onChooseImage?: (id: string) => void;
}

export const NailPolishCard: FC<NailPolishCardProps> = ({
  id,
  brand,
  name,
  imageUrl,
  colors = [],
  finishes = [],
  rating,
  onChooseImage
}) => {
  const router = useRouter();

  const handleContentClick = () => {
    router.push(`/polish/${id}`);
  };

  const handleImageAreaClick = () => {
    // Go to details page if we have any image (including 'n/a')
    if (imageUrl !== null) {
      router.push(`/polish/${id}`);
    } else {
      // Only go to image selection if there's no image at all
      onChooseImage?.(id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleContentClick();
    }
  };

  return (
    <StyledCard
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${brand} ${name}`}
    >
      <StyledClickableArea
        as={StyledImageContainer}
        onClick={(e) => {
          e.stopPropagation();
          handleImageAreaClick();
        }}
      >
        {(() => {
          // Case 1: Marked as no image available
          if (imageUrl === 'n/a') {
            return (
              <StyledChooseImageButton
                type="button"
                aria-label="View details for nail polish"
                $isNoImage
              >
                ❌ Marked as no image
              </StyledChooseImageButton>
            );
          }

          // Case 2: Has an actual image
          if (imageUrl && imageUrl !== 'n/a') {
            return (
              <StyledImage
                src={imageUrl}
                alt={`${brand} ${name}`}
                width={200}
                height={200}
              />
            );
          }

          // Case 3: No image (null or undefined)
          return (
            <StyledChooseImageButton
              type="button"
              aria-label="Choose image for nail polish"
            >
              Choose Image
            </StyledChooseImageButton>
          );
        })()}
      </StyledClickableArea>

      <StyledClickableArea
        as={StyledContent}
        onClick={(e) => {
          e.stopPropagation();
          handleContentClick();
        }}
      >
        <StyledMetadata>
          <StyledBrand>{brand}</StyledBrand>
          <StyledTitle>{name}</StyledTitle>
        </StyledMetadata>

        <StyledRating>{rating ? formatRating(rating) : 'Not Rated'}</StyledRating>

        <StyledColorPreview>
          {colors?.map((color, index) => (
            <StyledColorChip key={index} $color={color} />
          ))}
        </StyledColorPreview>

        <StyledFinishes>
          {finishes?.map((finish, index) => (
            <StyledTag key={index} $type={finish}>
              {finish}
            </StyledTag>
          ))}
        </StyledFinishes>
      </StyledClickableArea>
    </StyledCard>
  );
};
