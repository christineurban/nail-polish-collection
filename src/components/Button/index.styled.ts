'use client';

import styled from 'styled-components';
import { formStyles } from '@/theme/form';
import { Theme } from '@/theme/types';

interface StyledButtonProps {
  $variant?: 'danger' | 'secondary' | 'tertiary';
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

  ${({ theme, $variant }) => $variant === 'danger' && `
    background: #dc3545;
    &:hover {
      background: #c82333;
    }
  `}

  ${({ theme, $variant }) => $variant === 'secondary' && `
    background: ${theme.colors.gray[200]};
    color: ${theme.colors.gray[700]};
    &:hover {
      background: ${theme.colors.gray[300]};
    }
  `}

  ${({ theme, $variant }) => $variant === 'tertiary' && `
    background: transparent;
    border: 2px solid ${theme.colors.gray[200]};
    color: ${theme.colors.gray[700]};
    &:hover {
      background: ${theme.colors.gray[50]};
      border-color: ${theme.colors.gray[300]};
    }
    &:disabled {
      background: transparent;
      border-color: ${theme.colors.gray[100]};
      color: ${theme.colors.gray[400]};
    }
  `}
`;
