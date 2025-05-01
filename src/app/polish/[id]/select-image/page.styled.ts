import styled from 'styled-components';
import Link from 'next/link';

export const StyledErrorContainer = styled.div`
  padding: 1rem;
  text-align: center;
`;

export const StyledErrorMessage = styled.p`
  margin-bottom: 1rem;
`;

export const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[700]};
  }
`;

export const StyledLinkContainer = styled.div`
  display: flex;
  margin-top: 1rem;
  gap: 5px;
`;

export const StyledDivider = styled.div`
  color: ${({ theme }) => theme.colors.gray[500]};
`;
