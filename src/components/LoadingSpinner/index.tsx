import { motion } from 'framer-motion';
import { StyledSpinner, StyledLoadingOverlay } from './index.styled';

interface LoadingSpinnerProps {
  message?: string;
  overlay?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner = ({
  message = 'Loading...',
  overlay = false,
  size = 'medium'
}: LoadingSpinnerProps) => {
  const spinner = (
    <StyledSpinner
      as={motion.div}
      $size={size}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );

  if (overlay) {
    return (
      <StyledLoadingOverlay>
        {spinner}
        {message && <p>{message}</p>}
      </StyledLoadingOverlay>
    );
  }

  return spinner;
};
