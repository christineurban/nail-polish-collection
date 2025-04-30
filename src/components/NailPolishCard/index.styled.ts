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

export const StyledChooseImageButton = styled.button`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.text.secondary};
  border: none;
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  transition: ${({ theme }) => theme.transitions.base};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[200]};
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
  object-fit: cover;
`;

export const StyledContent = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  position: relative;
`;

export const StyledMetadata = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const StyledBrand = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

export const StyledTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  margin: 0;
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
`;

export const StyledColorPreview = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
  flex-wrap: wrap;
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
`;

export const StyledTag = styled.span<{ $type: string }>`
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  background: ${({ theme, $type }) => {
    switch ($type.toLowerCase()) {
      case 'metallic':
        return theme.colors.gray[200];
      case 'shimmer':
        return theme.colors.blue[100];
      case 'glitter':
        return theme.colors.purple[100];
      case 'holo':
        return theme.colors.pink[100];
      case 'matte':
        return theme.colors.orange[100];
      case 'cream':
        return theme.colors.green[100];
      case 'jelly':
        return theme.colors.pink[100];
      case 'magnetic':
        return theme.colors.purple[100];
      case 'neon':
        return theme.colors.green[100];
      case 'pearl':
        return theme.colors.blue[100];
      case 'chrome':
        return theme.colors.gray[200];
      case 'duochrome':
        return theme.colors.purple[100];
      case 'frost':
        return theme.colors.blue[100];
      case 'creme':
        return theme.colors.green[100];
      case 'glass':
        return theme.colors.blue[100];
      case 'iridescent':
        return theme.colors.purple[100];
      case 'multichrome':
        return theme.colors.pink[100];
      case 'sheer':
        return theme.colors.orange[100];
      case 'foil':
        return theme.colors.gray[200];
      case 'satin':
        return theme.colors.blue[100];
      default:
        return theme.colors.gray[100];
    }
  }};
  color: ${({ theme, $type }) => {
    switch ($type.toLowerCase()) {
      case 'metallic':
        return theme.colors.gray[700];
      case 'shimmer':
        return theme.colors.blue[700];
      case 'glitter':
        return theme.colors.purple[700];
      case 'holo':
        return theme.colors.pink[700];
      case 'matte':
        return theme.colors.orange[700];
      case 'cream':
        return theme.colors.green[700];
      case 'jelly':
        return theme.colors.pink[700];
      case 'magnetic':
        return theme.colors.purple[700];
      case 'neon':
        return theme.colors.green[700];
      case 'pearl':
        return theme.colors.blue[700];
      case 'chrome':
        return theme.colors.gray[700];
      case 'duochrome':
        return theme.colors.purple[700];
      case 'frost':
        return theme.colors.blue[700];
      case 'creme':
        return theme.colors.green[700];
      case 'glass':
        return theme.colors.blue[700];
      case 'iridescent':
        return theme.colors.purple[700];
      case 'multichrome':
        return theme.colors.pink[700];
      case 'sheer':
        return theme.colors.orange[700];
      case 'foil':
        return theme.colors.gray[700];
      case 'satin':
        return theme.colors.blue[700];
      default:
        return theme.colors.gray[700];
    }
  }};
`;
