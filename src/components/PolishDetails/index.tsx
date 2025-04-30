'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  StyledContainer,
  StyledHeader,
  StyledDetails,
  StyledImageContainer,
  StyledButton,
  StyledEditForm,
  StyledFormGroup,
  StyledInput,
  StyledSelect,
  StyledTextarea,
  StyledMultiSelect,
  StyledButtonGroup,
} from './index.styled';

type Rating = 'A_PLUS' | 'A' | 'A_MINUS' | 'B_PLUS' | 'B' | 'B_MINUS' | 'C_PLUS' | 'C' | 'C_MINUS' | 'D_PLUS' | 'D' | 'D_MINUS' | 'F';

interface Polish {
  id: string;
  brand: string;
  name: string;
  imageUrl: string | null;
  color: string;
  finishes: string[];
  rating: Rating | null;
  link: string | null;
  coats: number | null;
  notes: string | null;
  isOld: boolean | null;
  lastUsed: Date | null;
  totalBottles: number | null;
  emptyBottles: number | null;
  status: string | null;
}

interface PolishDetailsProps {
  polish: Polish;
}

export const PolishDetails = ({ polish }: PolishDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPolish, setEditedPolish] = useState<Polish>(polish);
  const [isLoading, setIsLoading] = useState(false);

  const ratings = [
    'A_PLUS', 'A', 'A_MINUS',
    'B_PLUS', 'B', 'B_MINUS',
    'C_PLUS', 'C', 'C_MINUS',
    'D_PLUS', 'D', 'D_MINUS',
    'F'
  ];

  const statuses = [
    'In Collection',
    'Wishlist',
    'Sold',
    'Gifted',
    'Empty',
    'Destashed'
  ];

  const formatRating = (rating: Rating | null): string => {
    if (!rating) return 'Not Rated';
    return rating.replace('_PLUS', '+').replace('_MINUS', '-');
  };

  const handleInputChange = (field: keyof Polish, value: any) => {
    setEditedPolish(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/polish/${polish.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedPolish),
      });

      if (!response.ok) {
        throw new Error('Failed to update polish');
      }

      window.location.reload();
    } catch (error) {
      console.error('Error updating polish:', error);
      alert('Failed to update polish. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderEditMode = () => (
    <StyledEditForm>
      <StyledFormGroup>
        <label>Brand:</label>
        <StyledInput
          type="text"
          value={editedPolish.brand}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('brand', e.target.value)}
        />
      </StyledFormGroup>

      <StyledFormGroup>
        <label>Name:</label>
        <StyledInput
          type="text"
          value={editedPolish.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
        />
      </StyledFormGroup>

      <StyledFormGroup>
        <label>Color:</label>
        <StyledInput
          type="text"
          value={editedPolish.color}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('color', e.target.value)}
        />
      </StyledFormGroup>

      <StyledFormGroup>
        <label>Finishes:</label>
        <StyledInput
          type="text"
          value={editedPolish.finishes.join(', ')}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('finishes', e.target.value.split(', '))}
          placeholder="Separate finishes with commas"
        />
      </StyledFormGroup>

      <StyledFormGroup>
        <label>Rating:</label>
        <StyledSelect
          value={editedPolish.rating || ''}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('rating', e.target.value || null)}
        >
          <option value="">Not Rated</option>
          {ratings.map(rating => (
            <option key={rating} value={rating}>
              {formatRating(rating as Rating)}
            </option>
          ))}
        </StyledSelect>
      </StyledFormGroup>

      <StyledFormGroup>
        <label>Link:</label>
        <StyledInput
          type="url"
          value={editedPolish.link || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('link', e.target.value || null)}
          placeholder="Product URL"
        />
      </StyledFormGroup>

      <StyledFormGroup>
        <label>Coats Needed:</label>
        <StyledInput
          type="number"
          value={editedPolish.coats || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('coats', e.target.value ? parseInt(e.target.value) : null)}
          min="1"
          max="5"
        />
      </StyledFormGroup>

      <StyledFormGroup>
        <label>Purchase Year:</label>
        <StyledInput
          type="number"
          value={editedPolish.isOld ? 'Yes' : 'No'}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('isOld', e.target.value === 'Yes')}
          min="2000"
          max={new Date().getFullYear()}
        />
      </StyledFormGroup>

      <StyledFormGroup>
        <label>Last Used:</label>
        <StyledInput
          type="date"
          value={editedPolish.lastUsed ? new Date(editedPolish.lastUsed).toISOString().split('T')[0] : ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('lastUsed', e.target.value ? new Date(e.target.value) : null)}
        />
      </StyledFormGroup>

      <StyledFormGroup>
        <label>Total Bottles:</label>
        <StyledInput
          type="number"
          value={editedPolish.totalBottles || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('totalBottles', e.target.value ? parseInt(e.target.value) : null)}
          min="0"
        />
      </StyledFormGroup>

      <StyledFormGroup>
        <label>Empty Bottles:</label>
        <StyledInput
          type="number"
          value={editedPolish.emptyBottles || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('emptyBottles', e.target.value ? parseInt(e.target.value) : null)}
          min="0"
        />
      </StyledFormGroup>

      <StyledFormGroup>
        <label>Status:</label>
        <StyledSelect
          value={editedPolish.status || ''}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('status', e.target.value || null)}
        >
          <option value="">Select Status</option>
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </StyledSelect>
      </StyledFormGroup>

      <StyledFormGroup>
        <label>Notes:</label>
        <StyledTextarea
          value={editedPolish.notes || ''}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('notes', e.target.value || null)}
          rows={4}
        />
      </StyledFormGroup>

      <StyledButtonGroup>
        <StyledButton onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </StyledButton>
        <StyledButton onClick={() => setIsEditing(false)} disabled={isLoading}>
          Cancel
        </StyledButton>
      </StyledButtonGroup>
    </StyledEditForm>
  );

  const renderViewMode = () => (
    <StyledDetails>
      <StyledImageContainer>
        {polish.imageUrl ? (
          <Image
            src={polish.imageUrl}
            alt={`${polish.brand} ${polish.name}`}
            width={300}
            height={300}
            priority
          />
        ) : (
          <p>No image available</p>
        )}
        <Link href={`/polish/${polish.id}/select-image`}>
          <StyledButton>Choose Image</StyledButton>
        </Link>
      </StyledImageContainer>

      <div className="details-content">
        <h2>Details</h2>
        {polish.color && <p><strong>Color</strong>{polish.color}</p>}
        {polish.finishes.length > 0 && (
          <p><strong>Finishes</strong>{polish.finishes.join(', ')}</p>
        )}
        {polish.rating && (
          <p><strong>Rating</strong>{formatRating(polish.rating)}</p>
        )}
        {polish.coats && <p><strong>Coats Needed</strong>{polish.coats}</p>}
        {polish.status && <p><strong>Status</strong>{polish.status}</p>}
        {polish.totalBottles || 0 > 0 && (
          <p><strong>Total Bottles</strong>{polish.totalBottles}</p>
        )}
        {polish.emptyBottles || 0 > 0 && (
          <p><strong>Empty Bottles</strong>{polish.emptyBottles}</p>
        )}
        {polish.isOld && (
          <p><strong>Is Old</strong>{polish.isOld ? 'Yes' : 'No'}</p>
        )}
        {polish.lastUsed && (
          <p>
            <strong>Last Used</strong>
            {new Date(polish.lastUsed).toLocaleDateString()}
          </p>
        )}
        {polish.notes && (
          <p><strong>Notes</strong>{polish.notes}</p>
        )}
        {polish.link && (
          <p>
            <strong>Source</strong>
            <Link href={polish.link} target="_blank" rel="noopener noreferrer">
              View
            </Link>
          </p>
        )}
        <StyledButton onClick={() => setIsEditing(true)}>
          Edit Details
        </StyledButton>
      </div>
    </StyledDetails>
  );

  return (
    <StyledContainer>
      <StyledHeader>
        <h1>{polish.brand} - {polish.name}</h1>
      </StyledHeader>
      {isEditing ? renderEditMode() : renderViewMode()}
    </StyledContainer>
  );
};
