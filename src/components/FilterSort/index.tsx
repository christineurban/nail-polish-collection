'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { useRouter, useSearchParams } from 'next/navigation';
import { Rating } from '@prisma/client';
import { getColorMapping, getTextColor } from '@/utils/colors';
import { SingleSelect } from '@/components/fields/SingleSelect';
import { MultiSelect } from '@/components/fields/MultiSelect';
import { Button } from '@/components/Button';
import { Input } from '@/components/fields/Input';

const StyledFiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;

  @media (min-width: 768px) {
    gap: 2rem;
  }
`;

const StyledContainer = styled.div`
  background: linear-gradient(to bottom right, #ffffff, #f8fafc);
  border-radius: 16px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    inset 0 2px 4px rgba(255, 255, 255, 0.9);
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 1.5rem;

  .clear-all {
    grid-column: 1 / -1;
    display: flex;
    align-items: flex-end;
    width: 100%;
  }

  /* For 2 columns layout */
  @media (min-width: 600px) and (max-width: 1199px) {
    grid-template-columns: repeat(2, 1fr);

    .clear-all {
      grid-column: 1 / -1;
    }
  }

  /* For 3 columns layout */
  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);

    .clear-all {
      grid-column: 3;
      grid-row: 3;
      align-self: flex-end;
    }
  }

  @media (min-width: 768px) {
    padding: 2rem;
    gap: 2rem;
  }
`;

const StyledFilterGroup = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 0.5rem;
  min-width: 0; /* Prevent overflow in flex/grid containers */
  height: 100%; /* Ensure consistent height */
`;

const StyledFilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const StyledLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #2D3748;
  letter-spacing: 0.025em;
  padding: 0.25rem 0;
`;

const StyledColorChip = styled.div<{ color: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 4px;
  border: 1px solid #E2E8F0;
  flex-shrink: 0;
  ${({ color }) => {
    const colorMapping = getColorMapping(color);
    return colorMapping.isGradient
      ? `background: ${colorMapping.background};`
      : `background-color: ${colorMapping.background};`;
  }}

  @media (min-width: 768px) {
    width: 20px;
    height: 20px;
  }
`;

const StyledColorPreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  max-width: 120px;
  gap: 4px;

  @media (min-width: 768px) {
    max-width: 100px;
    gap: 2px;
  }
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
  border-radius: 8px;
  margin: 0.25rem;
  padding: 0.875rem 1rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  min-height: 44px; /* Minimum touch target size */
  user-select: none;

  &:hover {
    opacity: 0.9;
  }

  input {
    margin-right: 0.75rem;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  @media (min-width: 768px) {
    border-radius: 6px;
    padding: 0.75rem 1rem;
    min-height: 40px;

    input {
      width: 16px;
      height: 16px;
    }
  }
`;

const StyledClearButton = styled.button`
  background: none;
  border: none;
  color: #E53E3E;
  font-size: 0.75rem;
  padding: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s ease;
  font-weight: 500;
  min-height: 24px;
  min-width: 24px; /* Minimum touch target size */

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

const StyledOption = styled.label`
  display: flex;
  align-items: center;
  padding: 0.875rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 0.25rem;
  min-height: 44px; /* Minimum touch target size */
  user-select: none;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[50]};
  }

  input {
    margin-right: 0.75rem;
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: ${({ theme }) => theme.colors.primary[500]};
  }

  @media (min-width: 768px) {
    padding: 0.75rem 1rem;
    border-radius: 6px;
    min-height: 40px;

    input {
      width: 16px;
      height: 16px;
    }
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
    isOld: string;
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
      hasImage: '',
      isOld: ''
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
          <Input
            type="text"
            placeholder="Search polishes..."
            value={filters.search}
            onChange={(value) => handleChange('search')(value)}
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

        <StyledFilterGroup>
          <StyledFilterHeader>
            <StyledLabel>Hide Old</StyledLabel>
            {filters.isOld && (
              <StyledClearButton onClick={() => clearFilter('isOld')}>
                Clear
              </StyledClearButton>
            )}
          </StyledFilterHeader>
          <SingleSelect
            value={filters.isOld === 'true' ? 'Yes' : 'No'}
            options={['Yes', 'No']}
            placeholder="Hide old polishes?"
            onChange={(selectedValue) => {
              handleChange('isOld')(selectedValue === 'Yes' ? 'true' : '');
            }}
          />
        </StyledFilterGroup>

        {(filters.brand.length > 0 || filters.finish.length > 0 || filters.color.length > 0 ||
          filters.search || filters.rating.length > 0 || filters.hasImage || filters.isOld) && (
          <StyledFilterGroup className="clear-all">
            <Button $variant="danger" $fullWidth onClick={clearAllFilters}>
              Clear All Filters
            </Button>
          </StyledFilterGroup>
        )}
      </StyledContainer>
    </StyledFiltersContainer>
  );
};
