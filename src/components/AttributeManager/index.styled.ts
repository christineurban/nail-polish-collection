'use client';

import styled from 'styled-components';

export const StyledContainer = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const StyledAddForm = styled.form`
  margin: 1rem 0;
  display: flex;
  gap: 1rem;

  > div {
    width: 300px;
  }
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
`;

export const StyledTableHeader = styled.th`
  text-align: left;
  padding: 1rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`;

export const StyledTableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }
`;

export const StyledTableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const StyledDeleteButton = styled.button`
  background-color: ${({ theme }) => theme.colors.error};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};

  &:hover {
    opacity: 0.9;
  }
`;

export const StyledErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: 0.5rem;
`;

export const StyledActionsCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  text-align: right;
  white-space: nowrap;
`;

export const StyledPolishCount = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-right: 1rem;
`;
