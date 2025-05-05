import styled from 'styled-components';

export const StyledCard = styled.div`
  display: flex;
  background: white;
  border-radius: 8px;
  padding: 20px;
  gap: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const StyledImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: contain;
  border: 1px solid #eee;
  border-radius: 4px;
`;

export const StyledContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const StyledTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray[900]};
  font-size: 1.2rem;
`;

export const StyledDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: 0.9rem;

  strong {
    color: ${({ theme }) => theme.colors.gray[900]};
  }
`;

export const StyledConfirmButton = styled.button<{ $isConfirmed: boolean }>`
  align-self: flex-start;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  ${({ $isConfirmed, theme }) => $isConfirmed ? `
    background: ${theme.colors.success[100]};
    color: ${theme.colors.success[700]};

    &:hover {
      background: ${theme.colors.success[200]};
    }
  ` : `
    background: ${theme.colors.primary[100]};
    color: ${theme.colors.primary[700]};

    &:hover {
      background: ${theme.colors.primary[200]};
    }
  `}
`;
