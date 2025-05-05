'use client';

import styled from 'styled-components';

export const StyledStatsContainer = styled.div`
  h1 {
    text-align: center;
    margin-bottom: 2rem;
    color: ${({ theme }) => theme.colors.primary[700]};
  }
`;

export const StyledTotalStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin-bottom: 3rem;

  div {
    text-align: center;
    padding: 2rem;
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    min-width: 200px;

    h3 {
      color: ${({ theme }) => theme.colors.primary[600]};
      margin-bottom: 1rem;
    }

    p {
      font-size: 2rem;
      font-weight: 600;
      color: ${({ theme }) => theme.colors.primary[500]};
    }
  }
`;
