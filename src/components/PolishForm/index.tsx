'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Rating } from '@prisma/client';
import { StyledForm, StyledLabel, StyledInput, StyledTextarea, StyledSelect, StyledButton, StyledFieldset, StyledLegend, StyledCheckboxGroup, StyledCheckbox, StyledRating, StyledStar } from './index.styled';

interface PolishFormProps {
  initialData?: {
    brand: string;
    name: string;
    description?: string | null;
    colors: string[];
    finishes: string[];
    rating?: Rating | null;
    isOld?: boolean;
  };
  availableColors: string[];
  availableFinishes: string[];
  onSubmit: (data: FormData) => Promise<void>;
}

export const PolishForm = ({
  initialData,
  availableColors,
  availableFinishes,
  onSubmit,
}: PolishFormProps) => {
  const router = useRouter();
  const [rating, setRating] = useState<number>(
    initialData?.rating ? Number(initialData.rating) : 0
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('rating', rating.toString());
    await onSubmit(formData);
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <div>
        <StyledLabel htmlFor="brand">Brand</StyledLabel>
        <StyledInput
          type="text"
          id="brand"
          name="brand"
          defaultValue={initialData?.brand}
          required
        />
      </div>

      <div>
        <StyledLabel htmlFor="name">Name</StyledLabel>
        <StyledInput
          type="text"
          id="name"
          name="name"
          defaultValue={initialData?.name}
          required
        />
      </div>

      <div>
        <StyledLabel htmlFor="description">Description</StyledLabel>
        <StyledTextarea
          id="description"
          name="description"
          defaultValue={initialData?.description || ''}
        />
      </div>

      <StyledFieldset>
        <StyledLegend>Colors</StyledLegend>
        <StyledCheckboxGroup>
          {availableColors.map((color) => (
            <StyledCheckbox key={color}>
              <input
                type="checkbox"
                id={`color-${color}`}
                name="colors"
                value={color}
                defaultChecked={initialData?.colors.includes(color)}
              />
              <label htmlFor={`color-${color}`}>{color}</label>
            </StyledCheckbox>
          ))}
        </StyledCheckboxGroup>
      </StyledFieldset>

      <StyledFieldset>
        <StyledLegend>Finishes</StyledLegend>
        <StyledCheckboxGroup>
          {availableFinishes.map((finish) => (
            <StyledCheckbox key={finish}>
              <input
                type="checkbox"
                id={`finish-${finish}`}
                name="finishes"
                value={finish}
                defaultChecked={initialData?.finishes.includes(finish)}
              />
              <label htmlFor={`finish-${finish}`}>{finish}</label>
            </StyledCheckbox>
          ))}
        </StyledCheckboxGroup>
      </StyledFieldset>

      <div>
        <StyledLabel>Rating</StyledLabel>
        <StyledRating>
          {[1, 2, 3, 4, 5].map((value) => (
            <StyledStar
              key={value}
              onClick={() => setRating(value)}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setRating(value);
                }
              }}
              filled={value <= rating}
              tabIndex={0}
              role="button"
              aria-label={`Rate ${value} star${value !== 1 ? 's' : ''}`}
            >
              ★
            </StyledStar>
          ))}
        </StyledRating>
      </div>

      <div>
        <StyledLabel htmlFor="isOld">Is Old</StyledLabel>
        <StyledInput
          type="checkbox"
          id="isOld"
          name="isOld"
          defaultChecked={initialData?.isOld}
        />
      </div>

      <div>
        <StyledButton type="submit">Save</StyledButton>
        <StyledButton
          type="button"
          variant="secondary"
          onClick={() => router.back()}
        >
          Cancel
        </StyledButton>
      </div>
    </StyledForm>
  );
};
