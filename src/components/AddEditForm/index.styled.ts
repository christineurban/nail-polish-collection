'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';

export const StyledForm = styled.form`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: ${({ theme }) => theme.colors.background.primary};
  padding: 3rem;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

export const StyledFormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
    margin: 0;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid ${({ theme }) => theme.colors.border.medium};
  }
`;

export const StyledFormRow = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

export const StyledFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;

  label {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

export const StyledTextarea = styled.textarea`
  padding: 0.875rem 1rem;
  border: 2px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  width: 100%;
  transition: all ${({ theme }) => theme.transitions.base};
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  min-height: 120px;
  resize: vertical;
  line-height: 1.5;

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.medium};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

export const StyledButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid ${({ theme }) => theme.colors.border.medium};

  button {
    min-width: 120px;
  }
`;

export const StyledDangerZone = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  border: 2px solid ${({ theme }) => theme.colors.error[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.error[50]};

  h3 {
    color: ${({ theme }) => theme.colors.error[700]};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    margin: 0 0 1rem;
  }

  p {
    color: ${({ theme }) => theme.colors.error[600]};
    margin: 0 0 1.5rem;
  }
`;
