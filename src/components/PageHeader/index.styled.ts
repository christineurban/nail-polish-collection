'use client';

import styled from 'styled-components';

export const StyledContainer = styled.div`
  width: 100%;
  margin-bottom: 2rem;
`;
export const StyledHeader = styled.div`
  ::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${({ theme }) => theme.colors.background.gradient};
    border-radius: ${({ theme }) => theme.borderRadius.full};
  }
`;
