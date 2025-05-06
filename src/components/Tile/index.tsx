import { ReactNode } from 'react';
import { StyledTile, StyledTileContent } from './index.styled';

interface TileProps {
  title: string;
  value: ReactNode;
  description?: string;
  variant?: 'stat' | 'attribute';
}

export const Tile = ({ title, value, description, variant = 'stat' }: TileProps) => {
  return (
    <StyledTile>
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
