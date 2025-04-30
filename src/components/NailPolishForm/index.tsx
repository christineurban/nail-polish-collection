'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../Button';
import { SingleSelect } from '../fields/SingleSelect';
import { MultiSelect } from '../fields/MultiSelect';
import { Input } from '../fields/Input';
import { Rating, RATING_OPTIONS } from '@/types/rating';
import {
  StyledForm,
  StyledFormGroup,
  StyledLabel,
  StyledTextarea,
  StyledButtonGroup,
} from './index.styled';

interface NailPolishFormData {
  imageUrl?: string;
  brand: string;
  name: string;
  colors: string[];
  finishes: string[];
  link?: string;
  coats?: number;
  rating?: Rating;
  notes?: string;
}

interface NailPolishFormProps {
  initialData?: NailPolishFormData;
  isEditing?: boolean;
  brands?: string[];
  availableColors?: string[];
  availableFinishes?: string[];
}

const NailPolishForm = ({
  initialData,
  isEditing = false,
  brands = [],
  availableColors = [],
  availableFinishes = []
}: NailPolishFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState<NailPolishFormData>(
    initialData || {
      brand: '',
      name: '',
      colors: [],
      finishes: [],
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/polish', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save nail polish');
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error saving nail polish:', error);
    }
  };

  const formatRating = (rating: string): string => {
    return rating.replace('_PLUS', '+').replace('_MINUS', '-');
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyledFormGroup>
        <Input
          label="Image URL"
          type="url"
          value={formData.imageUrl || ''}
          onChange={(value) => setFormData((prev) => ({ ...prev, imageUrl: value }))}
          placeholder="https://example.com/image.jpg"
        />
      </StyledFormGroup>

      <StyledFormGroup>
        <StyledLabel htmlFor="brand">Brand *</StyledLabel>
        <SingleSelect
          value={formData.brand}
          options={brands}
          placeholder="Select brand"
          onChange={(value) => setFormData((prev) => ({ ...prev, brand: value }))}
        />
      </StyledFormGroup>

      <StyledFormGroup>
        <Input
          label="Name *"
          type="text"
          value={formData.name}
          onChange={(value) => setFormData((prev) => ({ ...prev, name: value }))}
          required
        />
      </StyledFormGroup>

      <StyledFormGroup>
        <StyledLabel htmlFor="colors">Colors *</StyledLabel>
        <MultiSelect
          values={formData.colors}
          options={availableColors}
          placeholder="Select colors"
          onChange={(values) => setFormData((prev) => ({ ...prev, colors: values }))}
        />
      </StyledFormGroup>

      <StyledFormGroup>
        <StyledLabel htmlFor="finishes">Finishes *</StyledLabel>
        <MultiSelect
          values={formData.finishes}
          options={availableFinishes}
          placeholder="Select finishes"
          onChange={(values) => setFormData((prev) => ({ ...prev, finishes: values }))}
        />
      </StyledFormGroup>

      <StyledFormGroup>
        <Input
          label="Link"
          type="url"
          value={formData.link || ''}
          onChange={(value) => setFormData((prev) => ({ ...prev, link: value }))}
          placeholder="https://example.com/polish"
        />
      </StyledFormGroup>

      <StyledFormGroup>
        <Input
          label="Number of Coats"
          type="number"
          value={formData.coats || ''}
          onChange={(value) => setFormData((prev) => ({ ...prev, coats: parseInt(value) || undefined }))}
          min="1"
          max="5"
        />
      </StyledFormGroup>

      <StyledFormGroup>
        <StyledLabel htmlFor="rating">Rating</StyledLabel>
        <SingleSelect
          value={formData.rating || ''}
          options={RATING_OPTIONS}
          placeholder="Select rating"
          onChange={(value) => setFormData((prev) => ({ ...prev, rating: value as Rating || undefined }))}
        />
      </StyledFormGroup>

      <StyledFormGroup>
        <StyledLabel htmlFor="notes">Notes</StyledLabel>
        <StyledTextarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          rows={4}
        />
      </StyledFormGroup>

      <StyledButtonGroup>
        <Button type="button" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? 'Update' : 'Add'} Polish
        </Button>
      </StyledButtonGroup>
    </StyledForm>
  );
};

export default NailPolishForm;
