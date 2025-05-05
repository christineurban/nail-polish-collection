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
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  h3 {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.primary};
  }

  span {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

export const StyledDeleteButton = styled.button`
  background: ${({ theme }) => theme.colors.error};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 0.5rem;
  margin-top: 0.5rem;
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

export const StyledSortControls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const StyledSortButton = styled.button<{ $isActive: boolean }>`
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary[500] : theme.colors.text.secondary};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  border-bottom: 2px solid ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary[500] : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

export const StyledAddForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: flex-start;
  max-width: 500px;

  > div {
    flex: 1;
  }
`;

export const StyledMessage = styled.div<{ $type: 'error' | 'success' }>`
  padding: 0.75rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: 1rem;
  background: ${({ theme, $type }) =>
    $type === 'error'
      ? theme.colors.error + '15'
      : theme.colors.success + '15'};
  color: ${({ theme, $type }) =>
    $type === 'error'
      ? theme.colors.error
      : theme.colors.success};
  border: 1px solid ${({ theme, $type }) =>
    $type === 'error'
      ? theme.colors.error + '30'
      : theme.colors.success + '30'};
`;
