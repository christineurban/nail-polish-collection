'use client';

import { ReactNode } from 'react';
import { StyledCard } from './index.styled';

interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

const Card = ({ children, onClick, className }: CardProps) => {
  return (
    <StyledCard onClick={onClick} className={className}>
      {children}
    </StyledCard>
  );
};

export default Card;
