'use client';

import styled from 'styled-components';
import { theme } from '@/lib/theme';

export const StyledInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  width: 100%;

  .error {
    color: ${theme.colors.error};
    font-size: ${theme.typography.fontSize.sm};
    margin-top: ${theme.spacing.xs};
  }
`;

export const StyledLabel = styled.label`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text};
`;

export const StyledInput = styled.input`
  padding: 0.875rem 1rem;
  border: 2px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.fontSize.md};
  width: 100%;
  transition: all 0.2s ease-in-out;
  background: ${theme.colors.background};
  color: ${theme.colors.text};

  &:hover {
    border-color: #666666;
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primary}20;
  }

  &:disabled {
    background: ${theme.colors.border};
    cursor: not-allowed;
  }

  &[type="checkbox"] {
    width: 1.25rem;
    height: 1.25rem;
    margin-top: ${theme.spacing.xs};
    cursor: pointer;
  }
`;
