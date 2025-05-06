import styled, { css } from 'styled-components';

interface StyledTileContentProps {
  $variant?: 'stat' | 'attribute';
}

export const StyledTile = styled.div`
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const StyledTileContent = styled.div<StyledTileContentProps>`
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
    display: flex;
    flex-direction: column;
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
