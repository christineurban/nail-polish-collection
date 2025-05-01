'use client';

import { useRef, useState, useEffect } from 'react';
import { StyledContainer } from '../index.styled';
import {
  StyledButton,
  StyledOption,
  StyledTag,
} from './index.styled';
import { StyledDropdown } from '../index.styled';

interface MultiSelectProps {
  values: string[];
  options: string[];
  placeholder?: string;
  onChange: (values: string[]) => void;
  renderOption?: (option: string) => React.ReactNode;
  renderSelectedPreview?: (values: string[]) => React.ReactNode;
}

export const MultiSelect = ({
  values,
  options,
  placeholder = 'Select...',
  onChange,
  renderOption,
  renderSelectedPreview,
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    const newValues = values.includes(option)
      ? values.filter(v => v !== option)
      : [...values, option];
    onChange(newValues);
  };

  const handleRemove = (valueToRemove: string) => {
    const newValues = values.filter(value => value !== valueToRemove);
    onChange(newValues);
  };

  const renderDefaultSelectedPreview = () => (
    <>
      {values.map(value => (
        <StyledTag key={value}>
          {value}
          {mounted && (
            <button onClick={(e) => {
              e.stopPropagation();
              handleRemove(value);
            }}>&times;</button>
          )}
        </StyledTag>
      ))}
    </>
  );

  const renderDefaultOption = (option: string) => (
    <StyledOption key={option}>
      <input
        type="checkbox"
        checked={values.includes(option)}
        onChange={(e) => {
          e.stopPropagation();
          handleSelect(option, e as unknown as React.MouseEvent);
        }}
      />
      {option}
    </StyledOption>
  );

  return (
    <StyledContainer ref={containerRef}>
      <StyledButton
        ref={buttonRef}
        type="button"
        onClick={handleButtonClick}
        $isOpen={isOpen}
      >
        {values.length > 0 ? (
          renderSelectedPreview ? renderSelectedPreview(values) : renderDefaultSelectedPreview()
        ) : (
          placeholder
        )}
      </StyledButton>
      <StyledDropdown $isOpen={isOpen}>
        {options.map(option => (
          renderOption ? renderOption(option) : renderDefaultOption(option)
        ))}
      </StyledDropdown>
    </StyledContainer>
  );
};
