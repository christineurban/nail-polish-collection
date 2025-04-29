import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
    color: ${({ theme }) => theme.colors.text.primary};
    background:
      linear-gradient(120deg, ${({ theme }) => `${theme.colors.primary[100]}15`} 0%, transparent 30%),
      linear-gradient(60deg, ${({ theme }) => `${theme.colors.primary[100]}10`} 10%, transparent 40%),
      ${({ theme }) => theme.colors.background.primary};
    min-height: 100vh;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: ${({ theme }) => theme.borderRadius.md};
  }

  a {
    color: ${({ theme }) => theme.colors.primary[600]};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.base};
    position: relative;

    &:hover {
      color: ${({ theme }) => theme.colors.primary[700]};
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: ${({ theme }) => theme.colors.background.gradient};
      transition: width ${({ theme }) => theme.transitions.base};
    }

    &:hover::after {
      width: 100%;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
    line-height: ${({ theme }) => theme.typography.lineHeight.tight};
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
    background: ${({ theme }) => theme.colors.background.gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: ${({ theme }) => theme.spacing[6]};
    position: relative;
    display: inline-block;

    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 40%;
      height: 4px;
      background: ${({ theme }) => theme.colors.background.gradient};
      border-radius: ${({ theme }) => theme.borderRadius.full};
    }
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
    color: ${({ theme }) => theme.colors.primary[700]};
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }

  h4 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }

  h5 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }

  h6 {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing[4]};
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    padding: 0;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    &:focus {
      outline: none;
      box-shadow: ${({ theme }) => theme.shadows.focus};
    }
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
    border: 2px solid ${({ theme }) => theme.colors.border.light};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background-color: ${({ theme }) => theme.colors.background.primary};
    transition: all ${({ theme }) => theme.transitions.base};

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary[400]};
      box-shadow: ${({ theme }) => theme.shadows.focus};
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.text.muted};
    }
  }

  ::selection {
    background-color: ${({ theme }) => theme.colors.primary[200]};
    color: ${({ theme }) => theme.colors.primary[900]};
  }
`;
