'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter, useSearchParams } from 'next/navigation';
import { getColorMapping, getTextColor } from '@/utils/colors';

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
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
`;

const StyledLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #2D3748;
  margin-bottom: 0.25rem;
  letter-spacing: 0.025em;
`;

const StyledInput = styled.input`
  padding: 0.875rem 1rem;
  border: 2px solid #E2E8F0;
  border-radius: 10px;
  width: 100%;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  &:hover {
    border-color: #CBD5E0;
  }

  &:focus {
    outline: none;
    border-color: #4299E1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
  }

  &::placeholder {
    color: #A0AEC0;
  }
`;

const StyledSelect = styled.select`
  padding: 0.875rem 1rem;
  border: 2px solid #E2E8F0;
  border-radius: 10px;
  width: 100%;
  font-size: 0.875rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234A5568' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  &:hover {
    border-color: #CBD5E0;
  }

  &:focus {
    outline: none;
    border-color: #4299E1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
  }
`;

const StyledMultiSelect = styled.div`
  position: relative;
  width: 100%;
`;

const StyledMultiSelectButton = styled.button`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #E2E8F0;
  border-radius: 10px;
  background-color: white;
  text-align: left;
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  &:hover {
    border-color: #CBD5E0;
  }

  &:focus {
    outline: none;
    border-color: #4299E1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
  }

  &:after {
    content: '';
    width: 1em;
    height: 1em;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234A5568' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    transition: transform 0.2s ease;
  }
`;

const StyledDropdown = styled.div<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'block' : 'none'};
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  max-height: 250px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #F7FAFC;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #CBD5E0;
    border-radius: 8px;

    &:hover {
      background: #A0AEC0;
    }
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
    background-color: #EBF8FF;
  }

  input {
    margin-right: 0.75rem;
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: #4299E1;
  }
`;

const StyledSelectedCount = styled.span`
  background-color: #EBF8FF;
  color: #2B6CB0;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const StyledClearButton = styled.button`
  background: none;
  border: none;
  color: #E53E3E;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    background-color: #FED7D7;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
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

const StyledFilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
`;

const StyledFiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const StyledFilterActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 1rem;
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

const StyledColorOption = styled(StyledOption)<{ $colorName: string }>`
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

  &:hover {
    opacity: 0.9;
    ${({ $colorName }) => {
      const colorMapping = getColorMapping($colorName);
      return colorMapping.isGradient
        ? `background: ${colorMapping.background};`
        : `background-color: ${colorMapping.background};`;
    }}
  }

  input {
    border-color: currentColor;
    &:checked {
      background-color: currentColor;
      border-color: currentColor;
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
    purchaseYear: string;
    rating: string[];
    hasImage: string;
  };
}

export const FilterSort = ({ brands, finishes, colors, currentFilters }: FilterSortProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState(currentFilters);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isFinishOpen, setIsFinishOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);

  const ratings = [
    'A+', 'A', 'A-',
    'B+', 'B', 'B-',
    'C+', 'C', 'C-',
    'D+', 'D', 'D-',
    'F'
  ];

  // Convert display rating to enum format
  const formatRatingForQuery = (rating: string) => {
    return rating.replace('+', '_PLUS').replace('-', '_MINUS');
  };

  // Convert enum rating to display format
  const formatRatingForDisplay = (rating: string) => {
    return rating.replace('_PLUS', '+').replace('_MINUS', '-');
  };

  // Generate array of years from 2010 to current year
  const years = Array.from(
    { length: new Date().getFullYear() - 2009 },
    (_, i) => (2010 + i).toString()
  ).reverse();

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

  const handleMultiSelectChange = (key: 'brand' | 'finish' | 'color' | 'rating') => (value: string) => {
    const currentValues = filters[key] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    const newFilters = {
      ...filters,
      [key]: newValues
    };
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const multiSelect = target.closest('.multi-select');
      const isMultiSelectClick = multiSelect !== null;

      if (!isMultiSelectClick) {
        setIsBrandOpen(false);
        setIsFinishOpen(false);
        setIsColorOpen(false);
        setIsRatingOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleDropdownClick = (
    event: React.MouseEvent,
    dropdownSetter: React.Dispatch<React.SetStateAction<boolean>>,
    currentState: boolean
  ) => {
    event.stopPropagation();
    // Close all other dropdowns
    setIsBrandOpen(false);
    setIsFinishOpen(false);
    setIsColorOpen(false);
    setIsRatingOpen(false);
    // Toggle the clicked dropdown
    dropdownSetter(!currentState);
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
      purchaseYear: '',
      rating: [],
      hasImage: ''
    };
    setFilters(newFilters);
    updateUrl(newFilters);
  };

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
          <StyledMultiSelect className="multi-select">
            <StyledMultiSelectButton
              type="button"
              onClick={(e) => handleDropdownClick(e, setIsBrandOpen, isBrandOpen)}
            >
              {filters.brand.length > 0 ? (
                <>
                  {filters.brand.length} selected
                  <StyledSelectedCount>{filters.brand.length}</StyledSelectedCount>
                </>
              ) : (
                'Select brands'
              )}
            </StyledMultiSelectButton>
            <StyledDropdown $isOpen={isBrandOpen}>
              {brands.map(brand => (
                <StyledOption key={brand}>
                  <input
                    type="checkbox"
                    checked={filters.brand.includes(brand)}
                    onChange={() => handleMultiSelectChange('brand')(brand)}
                  />
                  {brand}
                </StyledOption>
              ))}
            </StyledDropdown>
          </StyledMultiSelect>
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
          <StyledMultiSelect className="multi-select">
            <StyledMultiSelectButton
              type="button"
              onClick={(e) => handleDropdownClick(e, setIsFinishOpen, isFinishOpen)}
            >
              {filters.finish.length > 0 ? (
                <>
                  {filters.finish.length} selected
                  <StyledSelectedCount>{filters.finish.length}</StyledSelectedCount>
                </>
              ) : (
                'Select finishes'
              )}
            </StyledMultiSelectButton>
            <StyledDropdown $isOpen={isFinishOpen}>
              {finishes.map(finish => (
                <StyledOption key={finish}>
                  <input
                    type="checkbox"
                    checked={filters.finish.includes(finish)}
                    onChange={() => handleMultiSelectChange('finish')(finish)}
                  />
                  {finish}
                </StyledOption>
              ))}
            </StyledDropdown>
          </StyledMultiSelect>
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
          <StyledMultiSelect className="multi-select">
            <StyledMultiSelectButton
              type="button"
              onClick={(e) => handleDropdownClick(e, setIsColorOpen, isColorOpen)}
            >
              {filters.color.length > 0 ? (
                <>
                  <StyledColorPreview>
                    {filters.color.slice(0, 3).map(color => (
                      <StyledColorChip key={color} color={color.toLowerCase()} />
                    ))}
                    {filters.color.length > 3 && (
                      <span>+{filters.color.length - 3}</span>
                    )}
                  </StyledColorPreview>
                  <StyledSelectedCount>{filters.color.length}</StyledSelectedCount>
                </>
              ) : (
                'Select colors'
              )}
            </StyledMultiSelectButton>
            <StyledDropdown $isOpen={isColorOpen}>
              {colors.map(color => (
                <StyledColorOption key={color} $colorName={color.toLowerCase()}>
                  <input
                    type="checkbox"
                    checked={filters.color.includes(color)}
                    onChange={() => handleMultiSelectChange('color')(color)}
                  />
                  {color}
                </StyledColorOption>
              ))}
            </StyledDropdown>
          </StyledMultiSelect>
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
          <StyledMultiSelect className="multi-select">
            <StyledMultiSelectButton
              type="button"
              onClick={(e) => handleDropdownClick(e, setIsRatingOpen, isRatingOpen)}
            >
              {filters.rating.length > 0 ? (
                <>
                  {filters.rating.length} selected
                  <StyledSelectedCount>{filters.rating.length}</StyledSelectedCount>
                </>
              ) : (
                'Select ratings'
              )}
            </StyledMultiSelectButton>
            <StyledDropdown $isOpen={isRatingOpen}>
              {ratings.map(rating => (
                <StyledOption key={rating}>
                  <input
                    type="checkbox"
                    checked={filters.rating.includes(formatRatingForQuery(rating))}
                    onChange={() => handleMultiSelectChange('rating')(formatRatingForQuery(rating))}
                  />
                  {rating}
                </StyledOption>
              ))}
            </StyledDropdown>
          </StyledMultiSelect>
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
          <StyledSelect
            value={filters.sort}
            onChange={(e) => handleChange('sort')(e)}
          >
            <option value="">Default</option>
            <option value="brand-asc">Brand (A-Z)</option>
            <option value="brand-desc">Brand (Z-A)</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="rating-desc">Rating (High-Low)</option>
            <option value="rating-asc">Rating (Low-High)</option>
            <option value="updated-desc">Recently Updated</option>
            <option value="updated-asc">Oldest Updated</option>
          </StyledSelect>
        </StyledFilterGroup>

        <StyledFilterGroup>
          <StyledFilterHeader>
            <StyledLabel>Purchase Year</StyledLabel>
            {filters.purchaseYear && (
              <StyledClearButton onClick={() => clearFilter('purchaseYear')}>
                Clear
              </StyledClearButton>
            )}
          </StyledFilterHeader>
          <StyledInput
            type="number"
            placeholder="Enter year..."
            value={filters.purchaseYear}
            onChange={(e) => handleChange('purchaseYear')(e)}
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
          <StyledSelect
            value={filters.hasImage}
            onChange={(e) => handleChange('hasImage')(e)}
          >
            <option value="">All</option>
            <option value="true">With Image</option>
            <option value="false">Without Image</option>
          </StyledSelect>
        </StyledFilterGroup>

        {(filters.brand.length > 0 || filters.finish.length > 0 || filters.color.length > 0 ||
          filters.search || filters.rating.length > 0 || filters.hasImage || filters.purchaseYear) && (
          <StyledFilterGroup style={{ gridColumn: '1 / -1' }}>
            <StyledClearAllButton onClick={clearAllFilters}>
              Clear All Filters
            </StyledClearAllButton>
          </StyledFilterGroup>
        )}
      </StyledContainer>
    </StyledFiltersContainer>
  );
};
