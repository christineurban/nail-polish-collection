'use client';

import styled from 'styled-components';
import { theme } from '@/lib/theme';

export const StyledContainer = styled.div`
  width: 100%;
  margin-bottom: 2rem;
`;

export const StyledHeader = styled.div`
  h1 {
    font-size: ${theme.typography.fontSize.xxl};
    background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: ${theme.spacing.md};
    position: relative;
    display: inline-block;

    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary});
      border-radius: ${theme.borderRadius.lg};
    }
  }

  p {
    font-size: ${theme.typography.fontSize.md};
    color: ${theme.colors.text};
    margin-top: ${theme.spacing.sm};
  }
`;
