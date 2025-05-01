import { useRef, useState, useEffect } from 'react';
import { StyledContainer } from '../index.styled';
import {
  StyledButton,
  StyledDropdown,
  StyledOption,
} from './index.styled';

interface SingleSelectProps {
  value: string;
  options: string[];
  placeholder?: string;
  onChange: (value: string) => void;
}

export const SingleSelect = ({ value, options, placeholder = 'Select...', onChange }: SingleSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <StyledContainer ref={containerRef}>
      <StyledButton
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        $isOpen={isOpen}
      >
        {value || placeholder}
      </StyledButton>
      <StyledDropdown $isOpen={isOpen}>
        {options.map(option => (
          <StyledOption
            key={option}
            $isSelected={value === option}
            onClick={() => handleSelect(option)}
          >
            {option}
          </StyledOption>
        ))}
      </StyledDropdown>
    </StyledContainer>
  );
};
