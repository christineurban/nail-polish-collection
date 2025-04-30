import styled from 'styled-components';
import { motion } from 'framer-motion';

export const StyledContainer = styled.div`
  font-family: Arial, sans-serif;
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

export const StyledSuccessMessage = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  color: #4CAF50;
  font-size: 1.2rem;
  text-align: center;

  svg {
    width: 48px;
    height: 48px;
    margin-bottom: 16px;
  }
`;
