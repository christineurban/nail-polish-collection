'use client';

import styled from 'styled-components';
import { theme } from '@/lib/theme';
import {
  StyledContainer,
  fieldStyles,
  dropdownStyles,
  chevronIconStyles
} from '../index.styled';

export { StyledContainer };

export const StyledButton = styled.button<{ $isOpen: boolean }>`
  ${fieldStyles}
  ${chevronIconStyles}
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  position: relative;

  &:after {
    position: absolute;
    right: 1rem;
  }
`;

export const StyledDropdown = styled.div<{ $isOpen: boolean }>`
  ${dropdownStyles}

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.secondary};
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border.medium};
    border-radius: 8px;

    &:hover {
      background: ${({ theme }) => theme.colors.border.dark};
    }
  }
`;

export const StyledOption = styled.label`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
  margin: 0.25rem;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[50]};
  }

  input {
    margin-right: 0.75rem;
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

export const StyledTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: ${({ theme }) => theme.colors.primary[50]};
  color: ${({ theme }) => theme.colors.primary[700]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin: 0.125rem 2rem 0.125rem 0;

  button {
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    font-size: 1.25em;
    line-height: 1;
    color: currentColor;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 1;
    }
  }
`;
