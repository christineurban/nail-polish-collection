import styled from 'styled-components';
import { motion } from 'framer-motion';

export const StyledLoadingOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  z-index: 10;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

export const StyledSpinner = styled(motion.div)<{ $size: 'small' | 'medium' | 'large' }>`
  width: ${({ $size }) => {
    switch ($size) {
      case 'small': return '20px';
      case 'large': return '60px';
      default: return '40px';
    }
  }};
  height: ${({ $size }) => {
    switch ($size) {
      case 'small': return '20px';
      case 'large': return '60px';
      default: return '40px';
    }
  }};
  border: ${({ $size }) => {
    switch ($size) {
      case 'small': return '2px';
      case 'large': return '6px';
      default: return '4px';
    }
  }} solid #f3f3f3;
  border-top: ${({ $size }) => {
    switch ($size) {
      case 'small': return '2px';
      case 'large': return '6px';
      default: return '4px';
    }
  }} solid ${({ theme }) => theme.colors.primary[500]};
  border-radius: 50%;
`;
