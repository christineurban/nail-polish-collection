'use client';

import styled from 'styled-components';

export const StyledContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

export const StyledHeader = styled.header`
  margin-bottom: 3rem;

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0;
    line-height: 1.2;
    font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  }
`;
