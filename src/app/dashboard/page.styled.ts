import styled from 'styled-components';

export const StyledDashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const StyledStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

export const StyledAttributeList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

export const StyledDeleteButton = styled.button`
  background: ${({ theme }) => theme.colors.error[500]};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.base};

  &:hover {
    background: ${({ theme }) => theme.colors.error[600]};
  }
`;

export const StyledSortControls = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
  flex-wrap: wrap;
`;

export const StyledSortButton = styled.button<{ $isActive: boolean }>`
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary[500] : theme.colors.background.secondary};
  color: ${({ theme, $isActive }) =>
    $isActive ? 'white' : theme.colors.text.primary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[500]};
    color: white;
  }
`;

export const StyledAddForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: flex-start;
`;

export const StyledMessage = styled.div<{ $type: 'error' | 'success' }>`
  padding: 1rem;
  margin: 1rem 0;
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ theme, $type }) =>
    $type === 'error' ? theme.colors.error[100] : theme.colors.success[100]};
  color: ${({ theme, $type }) =>
    $type === 'error' ? theme.colors.error[700] : theme.colors.success[700]};
  border: 1px solid ${({ theme, $type }) =>
    $type === 'error' ? theme.colors.error[300] : theme.colors.success[300]};
`;

export const StyledViewControls = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const StyledViewButton = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary[500] : theme.colors.background.secondary};
  color: ${({ theme, $isActive }) =>
    $isActive ? 'white' : theme.colors.text.primary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[500]};
    color: white;
  }
`;

export const StyledInputContainer = styled.div`
  max-width: 300px;
  margin-bottom: 1rem;
  flex-shrink: 0;
`;
