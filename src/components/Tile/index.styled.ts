import styled, { css } from 'styled-components';

interface StyledTileContentProps {
  $variant?: 'stat' | 'attribute';
}

interface StyledTileProps {
  $isActive?: boolean;
  $isClickable?: boolean;
}

export const StyledTile = styled.div<StyledTileProps>`
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all ${({ theme }) => theme.transitions.base};
  border: 2px solid transparent;
  transform: translateY(0);
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  ${({ $isClickable }) => $isClickable && css`
    cursor: pointer;

    &:hover {
      transform: translateY(-2px);
      box-shadow: ${({ theme }) => theme.shadows.md};
    }
  `}

  ${({ $isActive, theme }) => $isActive && css`
    border-color: ${theme.colors.primary[500]};
    box-shadow: ${theme.shadows.md}, 0 0 0 1px ${theme.colors.primary[500]};

    &:hover {
      transform: translateY(-4px);
      box-shadow: ${theme.shadows.lg}, 0 0 0 1px ${theme.colors.primary[500]};
    }
  `}
`;

export const StyledTileContent = styled.div<StyledTileContentProps>`
  flex: 1;
  display: flex;
  flex-direction: column;

  ${({ theme, $variant = 'stat' }) => $variant === 'stat' ? css`
    h3 {
      margin: 0 0 0.5rem;
      color: ${theme.colors.text.primary};
      font-size: ${theme.typography.fontSize.lg};
    }

    .value {
      font-size: ${theme.typography.fontSize['2xl']};
      font-weight: ${theme.typography.fontWeights.bold};
      color: ${theme.colors.primary[500]};
      margin: 0.5rem 0;
    }

    .description {
      color: ${theme.colors.text.secondary};
      font-size: ${theme.typography.fontSize.sm};
    }
  ` : css`
    gap: 0.5rem;

    h3 {
      margin: 0;
      color: ${theme.colors.text.primary};
    }

    span {
      color: ${theme.colors.text.secondary};
    }
  `}
`;
