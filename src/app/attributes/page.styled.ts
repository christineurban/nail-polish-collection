import styled from 'styled-components';

export const StyledAttributeList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

export const StyledAttributeCard = styled.div`
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  h3 {
    margin: 0 0 0.5rem;
    color: ${({ theme }) => theme.colors.text.primary};
  }

  span {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;
