import { ReactNode } from 'react';
import { StyledTile, StyledTileContent } from './index.styled';

interface TileProps {
  title: string;
  value: ReactNode;
  description?: string;
  variant?: 'stat' | 'attribute';
  onClick?: () => void;
  $isActive?: boolean;
}

export const Tile = ({
  title,
  value,
  description,
  variant = 'stat',
  onClick,
  $isActive = false
}: TileProps) => {
  return (
    <StyledTile
      onClick={onClick}
      $isActive={$isActive}
      $isClickable={!!onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <StyledTileContent $variant={variant}>
        {variant === 'stat' ? (
          <>
            <h3>{title}</h3>
            <div className="value">{value}</div>
            {description && <div className="description">{description}</div>}
          </>
        ) : (
          <>
            <h3>{title}</h3>
            <span>{value}</span>
          </>
        )}
      </StyledTileContent>
    </StyledTile>
  );
};
