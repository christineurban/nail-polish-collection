import styled from 'styled-components';
import { motion } from 'framer-motion';

export const StyledContainer = styled.div`
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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

export const StyledMetadata = styled.div`
  margin-bottom: 10px;
  padding-right: 150px; /* Make room for the save button */
`;

export const StyledNoImages = styled.p`
  color: red;
`;
