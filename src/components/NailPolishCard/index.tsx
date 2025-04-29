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

const formatRating = (rating: Rating | null): string => {
  if (!rating) return 'Not Rated';
  return rating.toString()
    .replace('_PLUS', '+')
    .replace('_MINUS', '-');
};

export const NailPolishCard: FC<NailPolishCardProps> = ({
  id,
  brand,
  name,
  imageUrl,
  colors,
  finishes,
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

  return (
    <StyledCard onClick={handleClick} tabIndex={0}>
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
