'use client';

import styled from 'styled-components';
import { formStyles } from '@/theme/form';

interface StyledButtonProps {
  $variant?: 'danger';
  $fullWidth?: boolean;
}

export const StyledButton = styled.button<StyledButtonProps>`
  height: ${formStyles.height};
  padding: ${formStyles.padding};
  border: ${formStyles.border} transparent;
  border-radius: ${formStyles.borderRadius};
  background: ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: ${formStyles.fontSize};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.05em;
  width: ${props => props.$fullWidth ? '100%' : 'auto'};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
    transform: translateY(-1px);
  }

  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.text.muted};
    cursor: not-allowed;
    transform: none;
  }

  ${props => props.$variant === 'danger' && `
    background: #dc3545;
    &:hover {
      background: #c82333;
    }
  `}
`;
