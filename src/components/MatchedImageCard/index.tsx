'use client';

import React from 'react';
import {
  StyledCard,
  StyledImage,
  StyledContent,
  StyledTitle,
  StyledDetails,
  StyledConfirmButton,
} from './index.styled';

interface Polish {
  id: string;
  name: string;
  brand: string;
  imageUrl: string | null;
}

interface ImageMatch {
  imageUrl: string;
  brand: string;
  name: string;
  matchedPolish: Polish | null;
  isConfirmed: boolean;
}

interface MatchedImageCardProps {
  match: ImageMatch;
  onConfirmToggle: () => void;
}

export const MatchedImageCard = ({ match, onConfirmToggle }: MatchedImageCardProps) => {
  return (
    <StyledCard>
      <StyledImage
        src={match.imageUrl}
        alt={`${match.brand} - ${match.name}`}
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
      <StyledContent>
        <StyledTitle>
          {match.brand} - {match.name}
        </StyledTitle>
        <StyledDetails>
          <div>
            <strong>Google Sheet:</strong> {match.brand} - {match.name}
          </div>
          <div>
            <strong>Database:</strong> {match.matchedPolish?.brand} - {match.matchedPolish?.name}
          </div>
        </StyledDetails>
        <StyledConfirmButton
          onClick={onConfirmToggle}
          $isConfirmed={match.isConfirmed}
        >
          {match.isConfirmed ? '✓ Confirmed' : 'Confirm Match'}
        </StyledConfirmButton>
      </StyledContent>
    </StyledCard>
  );
};
