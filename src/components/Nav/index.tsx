'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import { useState } from 'react';

const StyledNav = styled.nav`
  background: ${({ theme }) => theme.colors.background.gradient};
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: ${({ theme }) => theme.shadows.md};
  backdrop-filter: blur(8px);
  border-bottom: 1px solid ${({ theme }) => `${theme.colors.primary[400]}30`};
`;

const StyledContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    padding: 0 1.5rem;
    justify-content: space-between;
  }
`;

const StyledLogo = styled(Link)`
  color: ${({ theme }) => theme.colors.text.inverse};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  margin-right: auto;
  transition: all ${({ theme }) => theme.transitions.base};
  position: relative;
  padding: 0.5rem 0;

  &:hover {
    transform: translateY(-1px);
    text-shadow: 0 0 20px ${({ theme }) => `${theme.colors.primary[400]}50`};
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: ${({ theme }) => theme.colors.text.inverse};
    transition: width ${({ theme }) => theme.transitions.base};
  }

  &:hover::after {
    width: 100%;
  }
`;

const StyledLink = styled(Link)<{ $isActive: boolean }>`
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.text.inverse : `${theme.colors.text.inverse}80`};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme, $isActive }) =>
    $isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  transition: all ${({ theme }) => theme.transitions.base};
  backdrop-filter: ${({ $isActive }) => ($isActive ? 'blur(4px)' : 'none')};

  &:hover {
    color: ${({ theme }) => theme.colors.text.inverse};
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(4px);
    text-shadow: 0 0 20px ${({ theme }) => `${theme.colors.primary[400]}50`};
  }
`;

const StyledLinks = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: ${({ theme }) => theme.colors.background.gradient};
    padding: 1rem;
    gap: 0.5rem;
    transform: translateY(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
    opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
    visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
    transition: all 0.3s ease;
    box-shadow: ${({ theme }) => theme.shadows.md};
    backdrop-filter: blur(8px);
  }
`;

const StyledHamburger = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

export function Nav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const routes = [
    { path: '/polish/add', label: 'Add New Polish' },
    { path: '/image-selection', label: 'Select Missing Images' },
    { path: '/attributes', label: 'Attributes' },
    { path: '/stats', label: 'Stats' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <StyledNav>
      <StyledContainer>
        <StyledLogo href="/">My Nail Polish Collection 💅🏼</StyledLogo>
        <StyledHamburger
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          ☰
        </StyledHamburger>
        <StyledLinks $isOpen={isMenuOpen}>
          {routes.map(({ path, label }) => (
            <StyledLink
              key={path}
              href={path}
              $isActive={pathname === path}
              aria-current={pathname === path ? 'page' : undefined}
              onClick={() => setIsMenuOpen(false)}
            >
              {label}
            </StyledLink>
          ))}
        </StyledLinks>
      </StyledContainer>
    </StyledNav>
  );
}
