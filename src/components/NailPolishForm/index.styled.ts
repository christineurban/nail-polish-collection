import styled from 'styled-components';
import { theme } from '@/lib/theme';

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  max-width: 600px;
  margin: 0 auto;
`;

export const StyledFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

export const StyledLabel = styled.label`
  font-size: ${theme.fontSizes.sm};
  font-weight: ${theme.fontWeights.medium};
  color: ${theme.colors.text};
`;

export const StyledInput = styled.input`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.gray};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.text};
  background-color: ${theme.colors.white};
  transition: border-color 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }

  &::placeholder {
    color: ${theme.colors.textLight};
  }
`;

export const StyledTextarea = styled.textarea`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.gray};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.text};
  background-color: ${theme.colors.white};
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }

  &::placeholder {
    color: ${theme.colors.textLight};
  }
`;

export const StyledButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${theme.spacing.lg};
`;

export const StyledSelect = styled.select`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.gray};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSizes.md};
  color: ${theme.colors.text};
  background-color: ${theme.colors.white};
  transition: border-color 0.2s ease-in-out;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right ${theme.spacing.sm} center;
  background-size: 1em;
  padding-right: ${theme.spacing.xl};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }

  &::placeholder {
    color: ${theme.colors.textLight};
  }
`;
