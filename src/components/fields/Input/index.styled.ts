'use client';

import styled from 'styled-components';
import { fieldStyles } from '../index.styled';

export const StyledInput = styled.input`
  ${fieldStyles}
  padding: 0.5rem 1rem;
`;

export const StyledError = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;
