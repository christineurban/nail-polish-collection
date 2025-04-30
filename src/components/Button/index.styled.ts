'use client';

import styled from 'styled-components';

interface StyledButtonProps {
  $variant?: 'danger';
}

export const StyledButton = styled.button<StyledButtonProps>`
  background: ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.text.inverse};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
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
