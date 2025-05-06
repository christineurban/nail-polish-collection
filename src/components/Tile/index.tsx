import { ReactNode, MouseEvent } from 'react';
import { StyledTile, StyledTileContent, StyledValue, StyledDescription } from './index.styled';
import { BsTrash } from 'react-icons/bs';
import { Tooltip } from 'react-tooltip';

interface TileProps {
  title: string;
  value: ReactNode;
  description?: string;
  variant?: 'stat' | 'attribute';
  onClick?: () => void;
  $isActive?: boolean;
  onDelete?: () => void;
  showDelete?: boolean;
}

export const Tile = ({
  title,
  value,
  description,
  variant = 'stat',
  onClick,
  $isActive = false,
  onDelete,
  showDelete = false
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
            <div>
              <StyledValue>{value}</StyledValue>
              {description && <StyledDescription>{description}</StyledDescription>}
            </div>
          </>
        ) : (
          <>
            <h3>{title}</h3>
            <span>{value}</span>
          </>
        )}
      </StyledTileContent>
      {showDelete && onDelete && (
        <BsTrash
          onClick={(e: MouseEvent) => {
            e.stopPropagation();
            onDelete();
          }}
          role="button"
          aria-label={`Delete ${title}`}
          className="delete-icon"
          data-tooltip-id={`delete-tile-tooltip-${title}`}
          data-tooltip-content={`Delete ${title}`}
        />
      )}
      {showDelete && onDelete && (
        <Tooltip id={`delete-tile-tooltip-${title}`} />
      )}
    </StyledTile>
  );
};
