'use client';

import styled from 'styled-components';
import { theme } from '@/lib/theme';
import { StyledFieldWrapper, StyledLabel, fieldStyles } from '../index.styled';

export { StyledFieldWrapper, StyledLabel };

export const StyledInput = styled.input`
  padding: 0.875rem 1rem;
  border: 2px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  width: 100%;
  transition: all ${({ theme }) => theme.transitions.base};
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.medium};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.border.medium};
    box-shadow: 0 0 0 1px rgba(203, 213, 225, 0.3);
  }

  &[type="checkbox"] {
    width: 1.25rem;
    height: 1.25rem;
    margin-top: ${theme.spacing.xs};
    cursor: pointer;
  }
`;

export const StyledError = styled.span`
  color: ${({ theme }) => theme.colors.error[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: 0.25rem;
`;
