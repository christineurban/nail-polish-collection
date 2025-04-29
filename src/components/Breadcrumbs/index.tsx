'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import type { DefaultTheme } from 'styled-components';

const StyledBreadcrumbs = styled.nav`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const StyledList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
`;

const StyledItem = styled.li`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  &:not(:last-child)::after {
    content: '/';
    margin: 0 ${({ theme }) => theme.spacing[2]};
    color: ${({ theme }) => theme.colors.text.muted};
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.base};

    &:hover {
      color: ${({ theme }) => theme.colors.primary[600]};
    }
  }

  &:last-child {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  }
`;

interface BreadcrumbsProps {
  brand?: string;
  polishName?: string;
}

export const Breadcrumbs = ({ polishName, brand }: BreadcrumbsProps) => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  // For select-image pages, show Home > Polish Name > Select Image
  if (segments[0] === 'polish' && segments[2] === 'select-image') {
    return (
      <StyledBreadcrumbs aria-label="breadcrumb">
        <StyledList>
          <StyledItem>
            <Link href="/">Home</Link>
          </StyledItem>
          <StyledItem>
            <Link href={`/polish/${segments[1]}`}>
              {brand && polishName ? `${brand} - ${polishName}` : segments[1]}
            </Link>
          </StyledItem>
          <StyledItem>
            Select Image
          </StyledItem>
        </StyledList>
      </StyledBreadcrumbs>
    );
  }

  // For polish detail pages, show Home > Polish Name
  if (segments[0] === 'polish' && segments[1] && !segments[2]) {
    return (
      <StyledBreadcrumbs aria-label="breadcrumb">
        <StyledList>
          <StyledItem>
            <Link href="/">Home</Link>
          </StyledItem>
          <StyledItem>
            {polishName || segments[1]}
          </StyledItem>
        </StyledList>
      </StyledBreadcrumbs>
    );
  }

  // For other pages, show Home
  return (
    <StyledBreadcrumbs aria-label="breadcrumb">
      <StyledList>
        <StyledItem>
          <Link href="/">Home</Link>
        </StyledItem>
        {segments.length > 0 && (
          <StyledItem>
            {segments[segments.length - 1]
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </StyledItem>
        )}
      </StyledList>
    </StyledBreadcrumbs>
  );
};
