'use client';

import styled from 'styled-components';

const StyledMain = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem 4rem;
  min-height: calc(100vh - 64px); /* Account for nav height */

  @media (max-width: 640px) {
    padding: 2rem 1.5rem 3rem;
  }
`;

interface MainContainerProps {
  children: React.ReactNode;
}

export const MainContainer = ({ children }: MainContainerProps) => {
  return <StyledMain>{children}</StyledMain>;
};
