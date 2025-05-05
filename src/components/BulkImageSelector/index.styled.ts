import styled from 'styled-components';
import { motion } from 'framer-motion';

export const StyledContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

export const StyledPolishCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[300]};
  }

  ${props => props.$isSelected && `
    border: 3px solid ${props.theme.colors.primary[500]};
  `}
`;

export const StyledMetadata = styled.div`
  margin-bottom: 10px;
  padding-right: 150px;
`;

export const StyledNoImages = styled.p`
  color: ${({ theme }) => theme.colors.error[500]};
  text-align: center;
  margin: 20px 0;
`;

export const StyledLoadingOverlay = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[600]};
`;

export const StyledSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${({ theme }) => theme.colors.gray[200]};
  border-top-color: ${({ theme }) => theme.colors.primary[500]};
  border-radius: 50%;
  margin-bottom: 16px;
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

export const StyledSuccessMessage = styled.div`
  background: white;
  padding: 20px 40px;
  border-radius: 8px;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.success[700]};
`;

export const StyledCollapseText = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary[600]};
  cursor: pointer;
  font-size: 0.9rem;
  padding: 4px 8px;
  border-radius: 4px;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[50]};
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
