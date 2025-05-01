import styled from 'styled-components';
import { motion } from 'framer-motion';

export const StyledContainer = styled.div`
  width: 100%;
`;

export const StyledPolishCard = styled(motion.div)`
  border: 1px solid #ccc;
  margin: 20px 0;
  padding: 20px;
  border-radius: 8px;
  position: relative;
`;

export const StyledImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 20px;
`;

export const StyledImageContainer = styled.div`
  position: relative;
`;

export const StyledImage = styled.img<{ $isSelected?: boolean }>`
  max-width: 100%;
  height: auto;
  border: 1px solid #eee;
  ${props => props.$isSelected && `
    border: 3px solid #4CAF50;
  `}
`;

export const StyledSaveButton = styled.button`
  background: #2196F3;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 5;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export const StyledRemoveButton = styled.button<{ $hasSelectedImage?: boolean }>`
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  position: absolute;
  top: 20px;
  right: ${props => props.$hasSelectedImage ? '150px' : '20px'};
  z-index: 5;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  &:hover {
    background: #c82333;
  }
`;

export const StyledMetadata = styled.div`
  margin-bottom: 10px;
  padding-right: 150px; /* Make room for the save button */
`;

export const StyledNoImages = styled.p`
  color: red;
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
  z-index: 10;
`;

export const StyledSpinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2196F3;
  border-radius: 50%;
`;

export const StyledSuccessOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const StyledSuccessMessage = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #4CAF50;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  min-width: 300px;
  max-width: 90vw;
  transform-origin: center;
`;

export const StyledContent = styled(motion.div)`
  overflow: hidden;
`;

export const StyledCollapseText = styled.div`
  color: ${({ theme }) => theme.colors.primary[600]};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[700]};
    text-decoration: underline;
  }
`;

export const StyledImageCount = styled.div`
  background-color: ${({ theme }) => theme.colors.primary[50]};
  color: ${({ theme }) => theme.colors.primary[700]};
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
`;
