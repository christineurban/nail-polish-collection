import styled from 'styled-components';

export const StyledContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

export const StyledImageCard = styled.div<{ $markedForDeletion?: boolean }>`
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: 8px;
  padding: 10px;
  background: ${({ $markedForDeletion, theme }) =>
    $markedForDeletion ? theme.colors.error[50] : theme.colors.primary[50]};
`;

export const StyledImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: contain;
  margin-bottom: 10px;
  background: ${({ theme }) => theme.colors.primary[50]};
  border-radius: 4px;
`;

export const StyledSelect = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: 4px;
`;

export const StyledButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  background: ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.primary[50]};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const StyledDeleteButton = styled(StyledButton)<{ $active?: boolean }>`
  width: 100%;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.error[500] : 'transparent'};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary[50] : theme.colors.error[500]};
  border: 1px solid ${({ theme }) => theme.colors.error[500]};
  margin-top: 10px;

  &:hover {
    background: ${({ theme }) => theme.colors.error[500]};
    color: ${({ theme }) => theme.colors.primary[50]};
  }
`;

export const StyledSaveButton = styled(StyledButton)`
  background: ${({ theme }) => theme.colors.success[500]};

  &:hover {
    background: ${({ theme }) => theme.colors.success[600]};
  }
`;
