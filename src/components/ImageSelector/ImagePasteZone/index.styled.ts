import styled from 'styled-components';
import { motion } from 'framer-motion';

export const StyledPasteZone = styled.div`
  position: relative;
  width: 100%;
  min-height: 200px;
  border: 2px dashed ${({ theme }) => theme.colors.gray[300]};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ theme }) => theme.colors.gray[50]};
  margin: 20px 0;
  padding: 20px;

  &:hover, &:focus {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    background: ${({ theme }) => theme.colors.primary[50]};
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    min-height: 150px;
    padding: 15px;
    margin: 15px 0;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }
`;

export const StyledPasteContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  max-width: 300px;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

export const StyledPasteIcon = styled.div`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 1.75rem;
    margin-bottom: 4px;
  }
`;

export const StyledPasteText = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.gray[700]};
  margin: 0;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }
`;

export const StyledPasteSubtext = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin: 0;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
  }
`;

export const StyledLoadingOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.gray[700]};
  border-radius: 6px;
  backdrop-filter: blur(2px);

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;

export const StyledErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: 8px;
  text-align: center;
  max-width: 100%;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    margin-top: 4px;
  }
`;

export const StyledHiddenInput = styled.div`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
  outline: none;
  opacity: 0;
  pointer-events: none;
`;
