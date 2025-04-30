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
  justify-content: space-between;
  align-items: center;
`;

export const StyledDropdown = styled.div<{ $isOpen: boolean }>`
  ${dropdownStyles}
`;

export const StyledOption = styled.button<{ $isSelected: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.primary[50] : 'none'};
  color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.primary[700] : theme.colors.text.primary};
  text-align: left;
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  transition: all ${({ theme }) => theme.transitions.base};
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[50]};
    color: ${({ theme }) => theme.colors.primary[700]};
  }

  &:focus {
    outline: none;
    background: ${({ theme }) => theme.colors.primary[100]};
    color: ${({ theme }) => theme.colors.primary[700]};
  }

  &:after {
    content: ${({ $isSelected }) => $isSelected ? "'✓'" : "none"};
    font-size: 1.1em;
    color: ${({ theme }) => theme.colors.primary[700]};
  }
`;
