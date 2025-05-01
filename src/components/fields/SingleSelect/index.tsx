import { useRef, useState, useEffect } from 'react';
import { StyledContainer } from '../index.styled';
import {
  StyledButton,
  StyledOption,
} from './index.styled';
import { StyledDropdown } from '../index.styled';

interface SingleSelectProps {
  value: string;
  options: string[];
  placeholder?: string;
  onChange: (value: string) => void;
}

export const SingleSelect = ({ value, options, placeholder = 'Select...', onChange }: SingleSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(option);
    setIsOpen(false);
  };

  return (
    <StyledContainer ref={containerRef}>
      <StyledButton
        ref={buttonRef}
        type="button"
        onClick={handleButtonClick}
        $isOpen={isOpen}
      >
        {value || placeholder}
      </StyledButton>
      <StyledDropdown $isOpen={isOpen}>
        {options.map(option => (
          <StyledOption
            key={option}
            $isSelected={value === option}
            onClick={(e) => handleSelect(option, e)}
          >
            {option}
          </StyledOption>
        ))}
      </StyledDropdown>
    </StyledContainer>
  );
};
