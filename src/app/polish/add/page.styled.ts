'use client';

import styled from 'styled-components';
import { theme } from '@/lib/theme';

export const StyledContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${theme.spacing.lg};
`;

export const StyledHeader = styled.header`
  margin-bottom: ${theme.spacing.xl};

  h1 {
    font-size: ${theme.typography.fontSize.xxl};
    font-weight: ${theme.typography.fontWeight.bold};
    color: ${theme.colors.text};
  }
`;
