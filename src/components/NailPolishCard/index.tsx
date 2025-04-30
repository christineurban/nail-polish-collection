'use client';

import React, { FC } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
} from './index.styled';
import { Rating } from '@prisma/client';

const formatRating = (rating: Rating): string => {
  return rating.replace('_PLUS', '+').replace('_MINUS', '-');
};

interface NailPolishCardProps {
  id: string;
  brand: string;
  name: string;
  imageUrl?: string;
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

  const handleClick = () => {
    router.push(`/polish/${id}`);
  };

  const handleChooseImage = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (onChooseImage) {
      onChooseImage(id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <StyledCard
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${brand} ${name}`}
    >
      <StyledImageContainer>
        {imageUrl ? (
          <StyledImage
            src={imageUrl}
            alt={`${brand} ${name}`}
            width={200}
            height={200}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <StyledChooseImageButton
            onClick={handleChooseImage}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleChooseImage(e);
              }
            }}
            aria-label="Choose image for nail polish"
            type="button"
          >
            Choose Image
          </StyledChooseImageButton>
        )}
      </StyledImageContainer>

      <StyledContent>
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
      </StyledContent>
    </StyledCard>
  );
};
