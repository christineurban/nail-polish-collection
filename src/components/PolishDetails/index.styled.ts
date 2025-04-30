import styled from 'styled-components';

export const StyledButton = styled.button`
  background: ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.text.inverse};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.text.muted};
    cursor: not-allowed;
    transform: none;
  }
`;

export const StyledImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: ${({ theme }) => theme.colors.background.muted};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  display: flex;
  flex-direction: column;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  p {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    margin: 0;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }

  > a {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    text-decoration: none;

    ${StyledButton} {
      width: 100%;
      border-radius: 0;
      padding: 1rem;
      font-size: ${({ theme }) => theme.typography.fontSize.base};
      background: ${({ theme }) => `${theme.colors.primary[500]}CC`}; // 80% opacity
      backdrop-filter: blur(8px);
      box-shadow: none;
      transition: all ${({ theme }) => theme.transitions.base};

      &:hover {
        background: ${({ theme }) => theme.colors.primary[600]};
        transform: none;
      }
    }
  }
`;

export const StyledContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

export const StyledHeader = styled.div`
  margin-bottom: 3rem;

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0;
    line-height: 1.2;
    font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  }
`;

export const StyledDetails = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 4rem;
  align-items: flex-start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .details-content {
    background: ${({ theme }) => theme.colors.background.primary};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    padding: 2rem;
    box-shadow: ${({ theme }) => theme.shadows.sm};
    border: 1px solid ${({ theme }) => theme.colors.border.medium};

    h2 {
      font-size: ${({ theme }) => theme.typography.fontSize.xl};
      color: ${({ theme }) => theme.colors.text.primary};
      margin: 0 0 2rem 0;
      font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
      padding-bottom: 1rem;
      border-bottom: 2px solid ${({ theme }) => theme.colors.border.dark};
    }

    p {
      margin: 0;
      padding: 1rem 0;
      font-size: ${({ theme }) => theme.typography.fontSize.base};
      line-height: 1.6;
      color: ${({ theme }) => theme.colors.text.secondary};
      display: flex;
      align-items: baseline;
      border-bottom: 1px solid ${({ theme }) => theme.colors.border.medium};

      &:last-of-type {
        border-bottom: none;
      }

      strong {
        color: ${({ theme }) => theme.colors.text.primary};
        margin-right: 1rem;
        min-width: 140px;
        font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
      }

      a {
        color: ${({ theme }) => theme.colors.primary[500]};
        text-decoration: none;
        transition: color ${({ theme }) => theme.transitions.base};
        padding: 0.25rem 0.75rem;
        border-radius: ${({ theme }) => theme.borderRadius.md};
        background: ${({ theme }) => theme.colors.primary[50]};
        font-weight: ${({ theme }) => theme.typography.fontWeights.medium};

        &:hover {
          color: ${({ theme }) => theme.colors.primary[600]};
          background: ${({ theme }) => theme.colors.primary[100]};
        }
      }
    }

    ${StyledButton} {
      margin-top: 2rem;
      width: 100%;
    }
  }
`;

export const StyledEditForm = styled.div`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  background: ${({ theme }) => theme.colors.background.primary};
  padding: 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

export const StyledFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  label {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const StyledInput = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  width: 100%;
  transition: all ${({ theme }) => theme.transitions.base};
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.default};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

export const StyledSelect = styled.select`
  ${StyledInput}
`;

export const StyledTextarea = styled.textarea`
  ${StyledInput}
  min-height: 120px;
  resize: vertical;
`;

export const StyledButtonGroup = styled.div`
  grid-column: 1 / -1;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

export const StyledMultiSelect = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
