'use client';

import styled from 'styled-components';
import { theme } from '@/lib/theme';
import { StyledFieldWrapper, StyledLabel, fieldStyles } from '../index.styled';

export { StyledFieldWrapper, StyledLabel };

export const StyledInput = styled.input`
  ${fieldStyles}

  &[type="checkbox"] {
    width: 1.25rem;
    height: 1.25rem;
    margin-top: ${theme.spacing.xs};
    cursor: pointer;
  }
`;
