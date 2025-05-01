'use client';

import { InputHTMLAttributes, ChangeEvent } from 'react';
import { StyledInput, StyledLabel, StyledFieldWrapper, StyledError } from './index.styled';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  onChange: (value: string) => void;
}

export const Input = ({ label, error, onChange, ...props }: InputProps) => {
  return (
    <StyledFieldWrapper>
      {label && <StyledLabel>{label}</StyledLabel>}
      <StyledInput
        {...props}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      />
      {error && <StyledError>{error}</StyledError>}
    </StyledFieldWrapper>
  );
};
