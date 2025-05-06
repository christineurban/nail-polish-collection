import styled from 'styled-components';
import { getColorMapping, getTextColor } from '@/utils/colors';
import Image from 'next/image';

export const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.base};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

export const StyledImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
`;

export const StyledChooseImageButton = styled.button<{ $isNoImage?: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, $isNoImage }) =>
    $isNoImage
      ? theme.colors.gray[200]
      : theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.text.secondary};
  border: none;
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  transition: ${({ theme }) => theme.transitions.base};

  &:hover {
    background-color: ${({ theme, $isNoImage }) =>
      $isNoImage
        ? theme.colors.gray[300]
        : theme.colors.gray[200]};
    color: ${({ theme }) => theme.colors.gray[700]};
  }

  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

export const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: ${({ theme }) => theme.colors.gray[100]};
`;

export const StyledContent = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  position: relative;

  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing[3]};
    gap: ${({ theme }) => theme.spacing[1.5]};
  }
`;

export const StyledMetadata = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};

  @media (max-width: 480px) {
    gap: ${({ theme }) => theme.spacing[0.5]};
  }
`;

export const StyledBrand = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  @media (max-width: 480px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
  }
`;

export const StyledTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  margin: 0;

  @media (max-width: 480px) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;

export const StyledRating = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing[4]};
  right: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  background: ${({ theme }) => theme.colors.background.muted};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  @media (max-width: 480px) {
    top: ${({ theme }) => theme.spacing[3]};
    right: ${({ theme }) => theme.spacing[3]};
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    padding: ${({ theme }) => `${theme.spacing[0.5]} ${theme.spacing[1.5]}`};
  }
`;

export const StyledColorPreview = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: ${({ theme }) => theme.spacing[0.5]};
  }
`;

export const StyledColorChip = styled.div<{ $color: string }>`
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  ${({ $color }) => {
    const colorMapping = getColorMapping($color);
    return `background: ${colorMapping.background};`;
  }}
  border: 1px solid ${({ theme }) => theme.colors.border.default};
`;

export const StyledFinishes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[1]};

  @media (max-width: 480px) {
    gap: ${({ theme }) => theme.spacing[0.5]};
  }
`;

export const StyledTag = styled.span<{ $type: string }>`
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  background: ${({ theme }) => theme.colors.gray[100]};
  color: ${({ theme }) => theme.colors.gray[700]};

  @media (max-width: 480px) {
    padding: ${({ theme }) => `${theme.spacing[0.5]} ${theme.spacing[1.5]}`};
    font-size: ${({ theme }) => theme.typography.fontSize.xxs};
  }
`;

export const StyledClickableArea = styled.div`
  cursor: pointer;
`;
