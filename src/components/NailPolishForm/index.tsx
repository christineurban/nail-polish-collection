import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../Button';
import { Rating, RATING_OPTIONS } from '@/types/rating';
import {
  StyledForm,
  StyledFormGroup,
  StyledLabel,
  StyledInput,
  StyledTextarea,
  StyledButtonGroup,
  StyledSelect,
} from './index.styled';

interface NailPolishFormData {
  imageUrl?: string;
  brand: string;
  name: string;
  color: string;
  finishes: string[];
  link?: string;
  coats?: number;
  rating?: Rating;
  notes?: string;
}

interface NailPolishFormProps {
  initialData?: NailPolishFormData;
  isEditing?: boolean;
}

const NailPolishForm = ({ initialData, isEditing = false }: NailPolishFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState<NailPolishFormData>(
    initialData || {
      brand: '',
      name: '',
      color: '',
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
        body: JSON.stringify({
          ...formData,
          finishes: JSON.stringify(formData.finishes),
        }),
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

  const handleFinishesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const finishes = e.target.value.split(',').map((finish) => finish.trim());
    setFormData((prev) => ({ ...prev, finishes }));
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <StyledFormGroup>
        <StyledLabel htmlFor="imageUrl">Image URL</StyledLabel>
        <StyledInput
          type="url"
          id="imageUrl"
          value={formData.imageUrl || ''}
          onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
          placeholder="https://example.com/image.jpg"
        />
      </StyledFormGroup>

      <StyledFormGroup>
        <StyledLabel htmlFor="brand">Brand *</StyledLabel>
        <StyledInput
          type="text"
          id="brand"
          value={formData.brand}
          onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
          required
        />
      </StyledFormGroup>

      <StyledFormGroup>
        <StyledLabel htmlFor="name">Name *</StyledLabel>
        <StyledInput
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
      </StyledFormGroup>

      <StyledFormGroup>
        <StyledLabel htmlFor="color">Color *</StyledLabel>
        <StyledInput
          type="text"
          id="color"
          value={formData.color}
          onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
          required
        />
      </StyledFormGroup>

      <StyledFormGroup>
        <StyledLabel htmlFor="finishes">Finishes *</StyledLabel>
        <StyledInput
          type="text"
          id="finishes"
          value={formData.finishes.join(', ')}
          onChange={handleFinishesChange}
          placeholder="Creme, Shimmer, Glitter"
          required
        />
      </StyledFormGroup>

      <StyledFormGroup>
        <StyledLabel htmlFor="link">Link</StyledLabel>
        <StyledInput
          type="url"
          id="link"
          value={formData.link || ''}
          onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
          placeholder="https://example.com/polish"
        />
      </StyledFormGroup>

      <StyledFormGroup>
        <StyledLabel htmlFor="coats">Number of Coats</StyledLabel>
        <StyledInput
          type="number"
          id="coats"
          value={formData.coats || ''}
          onChange={(e) => setFormData((prev) => ({ ...prev, coats: parseInt(e.target.value) || undefined }))}
          min="1"
          max="5"
        />
      </StyledFormGroup>

      <StyledFormGroup>
        <StyledLabel htmlFor="rating">Rating</StyledLabel>
        <StyledSelect
          id="rating"
          value={formData.rating || ''}
          onChange={(e) => setFormData((prev) => ({ ...prev, rating: e.target.value as Rating || undefined }))}
        >
          <option value="">Select a rating</option>
          {RATING_OPTIONS.map((rating) => (
            <option key={rating} value={rating}>
              {rating.replace('_', ' ')}
            </option>
          ))}
        </StyledSelect>
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
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit">{isEditing ? 'Update' : 'Add'} Polish</Button>
      </StyledButtonGroup>
    </StyledForm>
  );
};

export default NailPolishForm;
