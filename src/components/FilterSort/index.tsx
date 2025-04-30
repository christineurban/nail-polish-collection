'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { useRouter, useSearchParams } from 'next/navigation';
import { Rating } from '@prisma/client';
import { getColorMapping, getTextColor } from '@/utils/colors';
import { SingleSelect } from '@/components/fields/SingleSelect';
import { MultiSelect } from '@/components/fields/MultiSelect';

const StyledContainer = styled.div`
  margin: 2rem auto;
  padding: 2rem;
  background: linear-gradient(to bottom right, #ffffff, #f8fafc);
  border-radius: 16px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    inset 0 2px 4px rgba(255, 255, 255, 0.9);
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
`;

const StyledFilterGroup = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 0.5rem;
`;

const StyledFilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 20px;
`;

const StyledLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #2D3748;
  letter-spacing: 0.025em;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.medium};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }
`;

const StyledColorChip = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 4px;
  border: 1px solid #E2E8F0;
  ${({ color }) => {
    const colorMapping = getColorMapping(color);
    return colorMapping.isGradient
      ? `background: ${colorMapping.background};`
      : `background-color: ${colorMapping.background};`;
  }}
`;

const StyledColorPreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  max-width: 100px;
  gap: 2px;
`;

const StyledColorOption = styled.label<{ $colorName: string }>`
  ${({ $colorName }) => {
    const colorMapping = getColorMapping($colorName);
    return colorMapping.isGradient
      ? `background: ${colorMapping.background};`
      : `background-color: ${colorMapping.background};`;
  }}
  color: ${({ $colorName }) => {
    const colorMapping = getColorMapping($colorName);
    return getTextColor(colorMapping.background);
  }};
  border-radius: 6px;
  margin: 0.25rem;
  padding: 0.75rem 1rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;

  &:hover {
    opacity: 0.9;
  }

  input {
    margin-right: 0.75rem;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;

const StyledFiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledClearButton = styled.button`
  background: none;
  border: none;
  color: #E53E3E;
  font-size: 0.75rem;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s ease;
  font-weight: 500;
  height: 20px;

  &:hover {
    color: #C53030;
  }

  &:focus {
    outline: none;
  }

  &::before {
    content: '×';
    font-size: 1.25rem;
    line-height: 1;
  }
`;

const StyledClearAllButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(to right, #FFF5F5, #FED7D7);
  color: #C53030;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &:hover {
    transform: translateY(-1px);
    box-shadow:
      0 6px 8px -1px rgba(0, 0, 0, 0.1),
      0 3px 6px -1px rgba(0, 0, 0, 0.06);
    background: linear-gradient(to right, #FED7D7, #FEB2B2);
  }

  &:focus {
    outline: none;
    box-shadow:
      0 0 0 3px rgba(229, 62, 62, 0.2),
      0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  &::before {
    content: '×';
    font-size: 1.25rem;
    line-height: 1;
    font-weight: 700;
  }
`;

const StyledOption = styled.label`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
  margin: 0.25rem;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[50]};
  }

  input {
    margin-right: 0.75rem;
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

interface FilterSortProps {
  brands: string[];
  finishes: string[];
  colors: string[];
  currentFilters: {
    brand: string[];
    finish: string[];
    color: string[];
    search: string;
    sort: string;
    rating: string[];
    hasImage: string;
  };
}

export const FilterSort = ({ brands, finishes, colors, currentFilters }: FilterSortProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState(currentFilters);

  const ratings = [
    'A_PLUS', 'A', 'A_MINUS',
    'B_PLUS', 'B', 'B_MINUS',
    'C_PLUS', 'C', 'C_MINUS',
    'D_PLUS', 'D', 'D_MINUS',
    'F'
  ];

  const formatRatingForDisplay = (rating: string): string => {
    return rating.replace('_PLUS', '+').replace('_MINUS', '-');
  };

  const updateUrl = (newFilters: typeof filters) => {
    const params = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(','));
        }
      } else if (value) {
        params.set(key, value);
      }
    });

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : '/');
  };

  const handleChange = (key: keyof typeof filters) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string
  ) => {
    const value = typeof event === 'string' ? event : event.target.value;
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  const handleBrandChange = (value: string) => {
    const newFilters = {
      ...filters,
      brand: value ? [value] : []
    };
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  const clearFilter = (key: keyof typeof filters) => {
    const newFilters = {
      ...filters,
      [key]: Array.isArray(filters[key]) ? [] : ''
    };
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  const clearAllFilters = () => {
    const newFilters = {
      brand: [],
      finish: [],
      color: [],
      search: '',
      sort: '',
      rating: [],
      hasImage: ''
    };
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  // Add these options at the component level
  const sortOptions = [
    { value: '', label: 'Default' },
    { value: 'brand-asc', label: 'Brand (A-Z)' },
    { value: 'brand-desc', label: 'Brand (Z-A)' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'rating-desc', label: 'Rating (High-Low)' },
    { value: 'rating-asc', label: 'Rating (Low-High)' },
    { value: 'updated-desc', label: 'Recently Updated' },
    { value: 'updated-asc', label: 'Oldest Updated' }
  ];

  const hasImageOptions = [
    { value: '', label: 'All' },
    { value: 'true', label: 'With Image' },
    { value: 'false', label: 'Without Image' }
  ];

  return (
    <StyledFiltersContainer>
      <StyledContainer>
        <StyledFilterGroup>
          <StyledFilterHeader>
            <StyledLabel>Search</StyledLabel>
            {filters.search && (
              <StyledClearButton onClick={() => clearFilter('search')}>
                Clear
              </StyledClearButton>
            )}
          </StyledFilterHeader>
          <StyledInput
            type="text"
            placeholder="Search polishes..."
            value={filters.search}
            onChange={(e) => handleChange('search')(e)}
          />
        </StyledFilterGroup>

        <StyledFilterGroup>
          <StyledFilterHeader>
            <StyledLabel>Brand</StyledLabel>
            {filters.brand.length > 0 && (
              <StyledClearButton onClick={() => clearFilter('brand')}>
                Clear
              </StyledClearButton>
            )}
          </StyledFilterHeader>
          <SingleSelect
            value={filters.brand[0] || ''}
            options={brands}
            placeholder="Select brand"
            onChange={handleBrandChange}
          />
        </StyledFilterGroup>

        <StyledFilterGroup>
          <StyledFilterHeader>
            <StyledLabel>Finish</StyledLabel>
            {filters.finish.length > 0 && (
              <StyledClearButton onClick={() => clearFilter('finish')}>
                Clear
              </StyledClearButton>
            )}
          </StyledFilterHeader>
          <MultiSelect
            values={filters.finish}
            options={finishes}
            placeholder="Select finishes"
            onChange={(values) => {
              const newFilters = {
                ...filters,
                finish: values
              };
              setFilters(newFilters);
              updateUrl(newFilters);
            }}
          />
        </StyledFilterGroup>

        <StyledFilterGroup>
          <StyledFilterHeader>
            <StyledLabel>Color</StyledLabel>
            {filters.color.length > 0 && (
              <StyledClearButton onClick={() => clearFilter('color')}>
                Clear
              </StyledClearButton>
            )}
          </StyledFilterHeader>
          <MultiSelect
            values={filters.color}
            options={colors}
            placeholder="Select colors"
            renderOption={(color) => (
              <StyledColorOption key={color} $colorName={color.toLowerCase()}>
                <input
                  type="checkbox"
                  checked={filters.color.includes(color)}
                  onChange={() => {
                    const newValues = filters.color.includes(color)
                      ? filters.color.filter(c => c !== color)
                      : [...filters.color, color];
                    const newFilters = {
                      ...filters,
                      color: newValues
                    };
                    setFilters(newFilters);
                    updateUrl(newFilters);
                  }}
                />
                {color}
              </StyledColorOption>
            )}
            renderSelectedPreview={(values) => (
              <StyledColorPreview>
                {values.map(color => (
                  <StyledColorChip key={color} color={color.toLowerCase()} />
                ))}
              </StyledColorPreview>
            )}
            onChange={(values) => {
              const newFilters = {
                ...filters,
                color: values
              };
              setFilters(newFilters);
              updateUrl(newFilters);
            }}
          />
        </StyledFilterGroup>

        <StyledFilterGroup>
          <StyledFilterHeader>
            <StyledLabel>Rating</StyledLabel>
            {filters.rating.length > 0 && (
              <StyledClearButton onClick={() => clearFilter('rating')}>
                Clear
              </StyledClearButton>
            )}
          </StyledFilterHeader>
          <MultiSelect
            values={filters.rating}
            options={ratings}
            placeholder="Select ratings"
            renderOption={(rating) => (
              <StyledOption key={rating}>
                <input
                  type="checkbox"
                  checked={filters.rating.includes(rating)}
                  onChange={() => {
                    const newValues = filters.rating.includes(rating)
                      ? filters.rating.filter(r => r !== rating)
                      : [...filters.rating, rating];
                    const newFilters = {
                      ...filters,
                      rating: newValues
                    };
                    setFilters(newFilters);
                    updateUrl(newFilters);
                  }}
                />
                {formatRatingForDisplay(rating)}
              </StyledOption>
            )}
            onChange={(values) => {
              const newFilters = {
                ...filters,
                rating: values
              };
              setFilters(newFilters);
              updateUrl(newFilters);
            }}
          />
        </StyledFilterGroup>

        <StyledFilterGroup>
          <StyledFilterHeader>
            <StyledLabel>Sort By</StyledLabel>
            {filters.sort && (
              <StyledClearButton onClick={() => clearFilter('sort')}>
                Clear
              </StyledClearButton>
            )}
          </StyledFilterHeader>
          <SingleSelect
            value={sortOptions.find(option => option.value === filters.sort)?.label || 'Default'}
            options={sortOptions.map(option => option.label)}
            placeholder="Select sort order"
            onChange={(selectedLabel) => {
              const selectedOption = sortOptions.find(option => option.label === selectedLabel);
              handleChange('sort')(selectedOption?.value || '');
            }}
          />
        </StyledFilterGroup>

        <StyledFilterGroup>
          <StyledFilterHeader>
            <StyledLabel>Has Image</StyledLabel>
            {filters.hasImage && (
              <StyledClearButton onClick={() => clearFilter('hasImage')}>
                Clear
              </StyledClearButton>
            )}
          </StyledFilterHeader>
          <SingleSelect
            value={hasImageOptions.find(option => option.value === filters.hasImage)?.label || 'All'}
            options={hasImageOptions.map(option => option.label)}
            placeholder="Select image filter"
            onChange={(selectedLabel) => {
              const selectedOption = hasImageOptions.find(option => option.label === selectedLabel);
              handleChange('hasImage')(selectedOption?.value || '');
            }}
          />
        </StyledFilterGroup>

        {(filters.brand.length > 0 || filters.finish.length > 0 || filters.color.length > 0 ||
          filters.search || filters.rating.length > 0 || filters.hasImage) && (
          <StyledFilterGroup className="clear-all">
            <StyledClearAllButton onClick={clearAllFilters}>
              Clear All Filters
            </StyledClearAllButton>
          </StyledFilterGroup>
        )}
      </StyledContainer>
    </StyledFiltersContainer>
  );
};
