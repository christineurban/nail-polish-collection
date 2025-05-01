'use client';

import styled from 'styled-components';
import { theme } from '@/lib/theme';
import { fieldStyles } from '../index.styled';

export const StyledInput = styled.input`
  ${fieldStyles}
`;

export const StyledError = styled.span`
  color: ${({ theme }) => theme.colors.error[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: 0.25rem;
`;
