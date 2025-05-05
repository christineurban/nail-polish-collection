'use client';

import { ButtonHTMLAttributes } from 'react';
import { StyledButton } from './index.styled';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  $variant?: 'danger' | 'secondary' | 'tertiary';
  $fullWidth?: boolean;
}

export const Button = ({
  children,
  $variant,
  $fullWidth,
  ...props
}: ButtonProps) => {
  return (
    <StyledButton
      $variant={$variant}
      $fullWidth={$fullWidth}
      {...props}
    >
      {children}
    </StyledButton>
  );
};
