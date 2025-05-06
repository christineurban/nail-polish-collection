'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import {
  StyledNav,
  StyledContainer,
  StyledLogo,
  StyledLink,
  StyledLinks,
  StyledHamburger
} from './index.styled';

export function Nav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const routes = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/polish/add', label: 'Add New Polish' },
    { path: '/image-selection', label: 'Select Missing Images' },
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
          $isOpen={isMenuOpen}
        >
          {isMenuOpen ? <HiX /> : <HiMenu />}
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
