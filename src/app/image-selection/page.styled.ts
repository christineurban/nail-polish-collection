import styled from 'styled-components';

export const StyledPagination = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 20px 0;
  padding: 15px;
  background-color: ${({ theme }) => theme.colors.gray[50]};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export const StyledPaginationInfo = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-align: center;
  padding: 8px 0;

  @media (max-width: 768px) {
    order: -1;
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
  }
`;

export const StyledPaginationButtons = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;

  @media (max-width: 768px) {
    button {
      flex: 1;
    }
  }

  @media (min-width: 769px) {
    width: auto;
  }
`;
