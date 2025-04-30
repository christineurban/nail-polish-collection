'use client';

import { ButtonHTMLAttributes } from 'react';
import { StyledButton } from './index.styled';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  $variant?: 'danger';
}

export const Button = ({
  children,
  $variant,
  ...props
}: ButtonProps) => {
  return (
    <StyledButton
      $variant={$variant}
      {...props}
    >
      {children}
    </StyledButton>
  );
};
