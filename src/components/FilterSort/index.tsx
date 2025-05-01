'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Rating } from '@prisma/client';
import { getColorMapping, getTextColor } from '@/utils/colors';
import { SingleSelect } from '@/components/fields/SingleSelect';
import { MultiSelect } from '@/components/fields/MultiSelect';
import { Button } from '@/components/Button';
import { Input } from '@/components/fields/Input';
import {
  StyledFiltersContainer,
  StyledContainer,
  StyledClearAllContainer,
  StyledFilterGroup,
  StyledFilterHeader,
  StyledLabel,
  StyledColorChip,
  StyledColorPreview,
  StyledColorOption,
  StyledClearButton,
  StyledOption
} from './index.styled';

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

        <StyledClearAllContainer>
          <Button onClick={clearAllFilters} $variant="danger">
            Clear All Filters
          </Button>
        </StyledClearAllContainer>
      </StyledContainer>
    </StyledFiltersContainer>
  );
};
