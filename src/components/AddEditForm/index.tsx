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
  StyledTextarea,
  StyledButtonGroup,
  StyledFormSection,
  StyledFormRow,
} from './index.styled';

interface AddEditFormData {
  id?: string;
  imageUrl?: string;
  brand: string;
  name: string;
  colors: string[];
  finishes: string[];
  link?: string;
  coats?: number;
  rating?: Rating;
  notes?: string;
  isOld?: boolean;
  lastUsed?: Date;
  totalBottles?: number;
  emptyBottles?: number;
}

interface AddEditFormProps {
  initialData?: AddEditFormData;
  isEditing?: boolean;
  brands?: string[];
  availableColors?: string[];
  availableFinishes?: string[];
}

export const AddEditForm = ({
  initialData,
  isEditing = false,
  brands = [],
  availableColors = [],
  availableFinishes = []
}: AddEditFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState<AddEditFormData>(
    initialData || {
      brand: '',
      name: '',
      colors: [],
      finishes: [],
    }
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isEditing ? `/api/polish/${formData.id}` : '/api/polish';
      const response = await fetch(endpoint, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save nail polish');
      }

      if (isEditing) {
        router.push(`/polish/${formData.id}`);
      } else {
        router.push('/');
      }
      router.refresh();
    } catch (error) {
      console.error('Error saving nail polish:', error);
      alert('Failed to save nail polish. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyledFormSection>
        <h3>Basic Information</h3>
        <StyledFormRow>
          <StyledFormGroup>
            <label>Brand *</label>
            <SingleSelect
              value={formData.brand}
              options={brands}
              placeholder="Select brand"
              onChange={(value) => setFormData((prev) => ({ ...prev, brand: value }))}
            />
          </StyledFormGroup>
          <StyledFormGroup>
            <label>Name *</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(value) => setFormData((prev) => ({ ...prev, name: value }))}
              required
            />
          </StyledFormGroup>
        </StyledFormRow>
      </StyledFormSection>

      <StyledFormSection>
        <h3>Appearance</h3>
        <StyledFormRow>
          <StyledFormGroup>
            <label>Colors *</label>
            <MultiSelect
              values={formData.colors}
              options={availableColors}
              placeholder="Select colors"
              onChange={(values) => setFormData((prev) => ({ ...prev, colors: values }))}
            />
          </StyledFormGroup>
          <StyledFormGroup>
            <label>Finishes *</label>
            <MultiSelect
              values={formData.finishes}
              options={availableFinishes}
              placeholder="Select finishes"
              onChange={(values) => setFormData((prev) => ({ ...prev, finishes: values }))}
            />
          </StyledFormGroup>
        </StyledFormRow>
      </StyledFormSection>

      <StyledFormSection>
        <h3>Details</h3>
        <StyledFormRow>
          <StyledFormGroup>
            <label>Rating</label>
            <SingleSelect
              value={formData.rating || ''}
              options={RATING_OPTIONS}
              placeholder="Select rating"
              onChange={(value) => setFormData((prev) => ({ ...prev, rating: value as Rating || undefined }))}
            />
          </StyledFormGroup>
          <StyledFormGroup>
            <label>Coats Needed</label>
            <Input
              type="number"
              value={formData.coats || ''}
              onChange={(value) => setFormData((prev) => ({ ...prev, coats: parseInt(value) || undefined }))}
              min="1"
              max="5"
            />
          </StyledFormGroup>
        </StyledFormRow>

        <StyledFormRow>
          <StyledFormGroup>
            <label>Total Bottles</label>
            <Input
              type="number"
              value={formData.totalBottles || ''}
              onChange={(value) => setFormData((prev) => ({ ...prev, totalBottles: parseInt(value) || undefined }))}
              min="0"
            />
          </StyledFormGroup>
          <StyledFormGroup>
            <label>Empty Bottles</label>
            <Input
              type="number"
              value={formData.emptyBottles || ''}
              onChange={(value) => setFormData((prev) => ({ ...prev, emptyBottles: parseInt(value) || undefined }))}
              min="0"
            />
          </StyledFormGroup>
        </StyledFormRow>

        <StyledFormRow>
          <StyledFormGroup>
            <label>Last Used</label>
            <Input
              type="date"
              value={formData.lastUsed ? new Date(formData.lastUsed).toISOString().split('T')[0] : ''}
              onChange={(value) => setFormData((prev) => ({ ...prev, lastUsed: value ? new Date(value) : undefined }))}
            />
          </StyledFormGroup>
          <StyledFormGroup>
            <label>Is older polish?</label>
            <SingleSelect
              value={formData.isOld === undefined ? '' : formData.isOld ? 'Yes' : 'No'}
              options={['Yes', 'No']}
              placeholder="Select answer"
              onChange={(value) => setFormData((prev) => ({ ...prev, isOld: value === 'Yes' }))}
            />
          </StyledFormGroup>
        </StyledFormRow>
      </StyledFormSection>

      <StyledFormSection>
        <h3>Additional Information</h3>
        <StyledFormGroup>
          <label>Link</label>
          <Input
            type="url"
            value={formData.link || ''}
            onChange={(value) => setFormData((prev) => ({ ...prev, link: value }))}
            placeholder="https://example.com/polish"
          />
        </StyledFormGroup>
        <StyledFormGroup>
          <label>Notes</label>
          <StyledTextarea
            value={formData.notes || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            rows={4}
          />
        </StyledFormGroup>
      </StyledFormSection>

      <StyledButtonGroup>
        <Button onClick={() => router.back()} type="button" $variant="secondary" disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : isEditing ? 'Update Polish' : 'Add Polish'}
        </Button>
      </StyledButtonGroup>
    </StyledForm>
  );
};
