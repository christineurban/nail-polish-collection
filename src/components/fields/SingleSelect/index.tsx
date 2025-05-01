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
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
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

  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  const handleButtonClick = () => {
    updateDropdownPosition();
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: string) => {
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
      {dropdownPosition && (
        <StyledDropdown
          $isOpen={isOpen}
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            transform: `translateY(${isOpen ? '0' : '-8px'})`,
          }}
        >
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
      )}
    </StyledContainer>
  );
};
