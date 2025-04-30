'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Rating } from '@prisma/client';
import { SingleSelect } from '@/components/fields/SingleSelect';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import {
  StyledContainer,
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
  StyledFormSection,
  StyledFormRow,
  StyledTag,
  StyledDropdown,
  StyledOption,
  StyledMultiSelectContainer,
  StyledSingleSelectContainer,
  StyledSingleSelectButton,
  StyledSingleDropdown,
  StyledSingleOption,
  StyledImageActions,
  StyledFormContainer,
} from './index.styled';

interface Polish {
  id: string;
  brand: string;
  name: string;
  imageUrl: string | null;
  colors: string[];
  finishes: string[];
  rating: Rating | null;
  link: string | null;
  coats: number | null;
  notes: string | null;
  isOld: boolean | null;
  lastUsed: Date | null;
  totalBottles: number | null;
  emptyBottles: number | null;
}

interface NailPolishDetailsProps {
  polish: Polish;
  brands: string[];
  availableColors: string[];
  availableFinishes: string[];
}

export const NailPolishDetails = ({ polish, brands, availableColors, availableFinishes }: NailPolishDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isRemovingImage, setIsRemovingImage] = useState(false);
  const [editedPolish, setEditedPolish] = useState<Polish>(polish);
  const [isLoading, setIsLoading] = useState(false);
  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
  const [isFinishDropdownOpen, setIsFinishDropdownOpen] = useState(false);
  const [isRatingDropdownOpen, setIsRatingDropdownOpen] = useState(false);
  const [isOldDropdownOpen, setIsOldDropdownOpen] = useState(false);

  const colorDropdownRef = useRef<HTMLDivElement>(null);
  const finishDropdownRef = useRef<HTMLDivElement>(null);
  const ratingDropdownRef = useRef<HTMLDivElement>(null);
  const isOldDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorDropdownRef.current &&
        !colorDropdownRef.current.contains(event.target as Node)
      ) {
        setIsColorDropdownOpen(false);
      }
      if (
        finishDropdownRef.current &&
        !finishDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFinishDropdownOpen(false);
      }
      if (
        ratingDropdownRef.current &&
        !ratingDropdownRef.current.contains(event.target as Node)
      ) {
        setIsRatingDropdownOpen(false);
      }
      if (
        isOldDropdownRef.current &&
        !isOldDropdownRef.current.contains(event.target as Node)
      ) {
        setIsOldDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const ratings: Rating[] = [
    'A_PLUS', 'A', 'A_MINUS',
    'B_PLUS', 'B', 'B_MINUS',
    'C_PLUS', 'C', 'C_MINUS',
    'D_PLUS', 'D', 'D_MINUS',
    'F'
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

  const handleAddColor = (color: string) => {
    if (!editedPolish.colors.includes(color)) {
      setEditedPolish(prev => ({
        ...prev,
        colors: [...prev.colors, color]
      }));
    }
    setIsColorDropdownOpen(false);
  };

  const handleAddFinish = (finish: string) => {
    if (!editedPolish.finishes.includes(finish)) {
      setEditedPolish(prev => ({
        ...prev,
        finishes: [...prev.finishes, finish]
      }));
    }
    setIsFinishDropdownOpen(false);
  };

  const handleRemoveColor = (colorToRemove: string) => {
    setEditedPolish(prev => ({
      ...prev,
      colors: prev.colors.filter(color => color !== colorToRemove)
    }));
  };

  const handleRemoveFinish = (finishToRemove: string) => {
    setEditedPolish(prev => ({
      ...prev,
      finishes: prev.finishes.filter(finish => finish !== finishToRemove)
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

  const handleRemoveImage = async () => {
    try {
      setIsRemovingImage(true);
      const response = await fetch('/api/remove-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: polish.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove image');
      }

      window.location.reload();
    } catch (error) {
      console.error('Error removing image:', error);
      alert('Failed to remove image. Please try again.');
    } finally {
      setIsRemovingImage(false);
    }
  };

  const renderEditMode = () => (
    <StyledContainer>
      <StyledFormContainer>
        <PageHeader
          title={`Edit ${polish.brand} - ${polish.name}`}
        />
        <StyledEditForm>
          <StyledFormSection>
            <h3>Basic Information</h3>
            <StyledFormRow>
              <StyledFormGroup>
                <label>Brand</label>
                <SingleSelect
                  value={editedPolish.brand}
                  options={brands}
                  placeholder="Select brand"
                  onChange={(value) => handleInputChange('brand', value)}
                />
              </StyledFormGroup>
              <StyledFormGroup>
                <label>Name</label>
                <StyledInput
                  type="text"
                  value={editedPolish.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                />
              </StyledFormGroup>
            </StyledFormRow>
          </StyledFormSection>

          <StyledFormSection>
            <h3>Appearance</h3>
            <StyledFormRow>
              <StyledFormGroup>
                <label>Colors</label>
                <StyledMultiSelectContainer ref={colorDropdownRef}>
                  <StyledMultiSelect onClick={() => setIsColorDropdownOpen(!isColorDropdownOpen)}>
                    {editedPolish.colors.map(color => (
                      <StyledTag key={color}>
                        {color}
                        <button onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveColor(color);
                        }}>&times;</button>
                      </StyledTag>
                    ))}
                  </StyledMultiSelect>
                  {isColorDropdownOpen && (
                    <StyledDropdown>
                      {availableColors
                        .filter(color => !editedPolish.colors.includes(color))
                        .map(color => (
                          <StyledOption
                            key={color}
                            onClick={() => handleAddColor(color)}
                          >
                            {color}
                          </StyledOption>
                        ))}
                    </StyledDropdown>
                  )}
                </StyledMultiSelectContainer>
              </StyledFormGroup>
              <StyledFormGroup>
                <label>Finishes</label>
                <StyledMultiSelectContainer ref={finishDropdownRef}>
                  <StyledMultiSelect onClick={() => setIsFinishDropdownOpen(!isFinishDropdownOpen)}>
                    {editedPolish.finishes.map(finish => (
                      <StyledTag key={finish}>
                        {finish}
                        <button onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFinish(finish);
                        }}>&times;</button>
                      </StyledTag>
                    ))}
                  </StyledMultiSelect>
                  {isFinishDropdownOpen && (
                    <StyledDropdown>
                      {availableFinishes
                        .filter(finish => !editedPolish.finishes.includes(finish))
                        .map(finish => (
                          <StyledOption
                            key={finish}
                            onClick={() => handleAddFinish(finish)}
                          >
                            {finish}
                          </StyledOption>
                        ))}
                    </StyledDropdown>
                  )}
                </StyledMultiSelectContainer>
              </StyledFormGroup>
            </StyledFormRow>
          </StyledFormSection>

          <StyledFormSection>
            <h3>Details</h3>
            <StyledFormRow>
              <StyledFormGroup>
                <label>Rating</label>
                <StyledSingleSelectContainer ref={ratingDropdownRef}>
                  <StyledSingleSelectButton
                    type="button"
                    onClick={() => setIsRatingDropdownOpen(!isRatingDropdownOpen)}
                  >
                    {editedPolish.rating ? formatRating(editedPolish.rating) : 'Not Rated'}
                  </StyledSingleSelectButton>
                  <StyledSingleDropdown $isOpen={isRatingDropdownOpen}>
                    <StyledSingleOption
                      $isSelected={!editedPolish.rating}
                      onClick={() => {
                        handleInputChange('rating', null);
                        setIsRatingDropdownOpen(false);
                      }}
                    >
                      Not Rated
                    </StyledSingleOption>
                    {ratings.map(rating => (
                      <StyledSingleOption
                        key={rating}
                        $isSelected={editedPolish.rating === rating}
                        onClick={() => {
                          handleInputChange('rating', rating);
                          setIsRatingDropdownOpen(false);
                        }}
                      >
                        {formatRating(rating as Rating)}
                      </StyledSingleOption>
                    ))}
                  </StyledSingleDropdown>
                </StyledSingleSelectContainer>
              </StyledFormGroup>
              <StyledFormGroup>
                <label>Coats Needed</label>
                <StyledInput
                  type="number"
                  value={editedPolish.coats || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('coats', e.target.value ? parseInt(e.target.value) : null)}
                  min="1"
                  max="5"
                />
              </StyledFormGroup>
            </StyledFormRow>

            <StyledFormRow>
              <StyledFormGroup>
                <label>Total Bottles</label>
                <StyledInput
                  type="number"
                  value={editedPolish.totalBottles || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('totalBottles', e.target.value ? parseInt(e.target.value) : null)}
                  min="0"
                />
              </StyledFormGroup>
              <StyledFormGroup>
                <label>Empty Bottles</label>
                <StyledInput
                  type="number"
                  value={editedPolish.emptyBottles || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('emptyBottles', e.target.value ? parseInt(e.target.value) : null)}
                  min="0"
                />
              </StyledFormGroup>
            </StyledFormRow>

            <StyledFormRow>
              <StyledFormGroup>
                <label>Last Used</label>
                <StyledInput
                  type="date"
                  value={editedPolish.lastUsed ? new Date(editedPolish.lastUsed).toISOString().split('T')[0] : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('lastUsed', e.target.value ? new Date(e.target.value) : null)}
                />
              </StyledFormGroup>
              <StyledFormGroup>
                <label>Is older polish?</label>
                <StyledSingleSelectContainer ref={isOldDropdownRef}>
                  <StyledSingleSelectButton
                    type="button"
                    onClick={() => setIsOldDropdownOpen(!isOldDropdownOpen)}
                  >
                    {editedPolish.isOld === null ? 'Select answer' : editedPolish.isOld ? 'Yes' : 'No'}
                  </StyledSingleSelectButton>
                  <StyledSingleDropdown $isOpen={isOldDropdownOpen}>
                    <StyledSingleOption
                      $isSelected={editedPolish.isOld === true}
                      onClick={() => {
                        handleInputChange('isOld', true);
                        setIsOldDropdownOpen(false);
                      }}
                    >
                      Yes
                    </StyledSingleOption>
                    <StyledSingleOption
                      $isSelected={editedPolish.isOld === false}
                      onClick={() => {
                        handleInputChange('isOld', false);
                        setIsOldDropdownOpen(false);
                      }}
                    >
                      No
                    </StyledSingleOption>
                  </StyledSingleDropdown>
                </StyledSingleSelectContainer>
              </StyledFormGroup>
            </StyledFormRow>
          </StyledFormSection>

          <StyledFormSection>
            <h3>Additional Information</h3>
            <StyledFormGroup>
              <label>Link</label>
              <StyledInput
                type="url"
                value={editedPolish.link || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('link', e.target.value || null)}
                placeholder="Product URL"
              />
            </StyledFormGroup>
            <StyledFormGroup>
              <label>Notes</label>
              <StyledTextarea
                value={editedPolish.notes || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('notes', e.target.value || null)}
                rows={4}
              />
            </StyledFormGroup>
          </StyledFormSection>

          <StyledButtonGroup>
            <Button onClick={() => setIsEditing(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </StyledButtonGroup>
        </StyledEditForm>
      </StyledFormContainer>
    </StyledContainer>
  );

  const renderViewMode = () => (
    <StyledContainer>
      <PageHeader
        title={`${polish.brand} - ${polish.name}`}
      />
      <StyledDetails>
        <div>
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
          </StyledImageContainer>
          <StyledImageActions>
            <Button
              onClick={() => window.location.href = `/polish/${polish.id}/select-image`}
              $fullWidth
            >
              Choose Image
            </Button>
            {polish.imageUrl && (
              <Button
                $variant="danger"
                onClick={handleRemoveImage}
                disabled={isRemovingImage}
                $fullWidth
              >
                {isRemovingImage ? 'Removing...' : 'Remove Image'}
              </Button>
            )}
          </StyledImageActions>
        </div>

        <div className="details-content">
          <h2>Details</h2>
          <p>
            <strong>Source</strong>
            {polish.link ? (
              <Link href={polish.link} target="_blank" rel="noopener noreferrer">
                {polish.link}
              </Link>
            ) : '-'}
          </p>
          <p><strong>Colors</strong>{polish.colors.length > 0 ? polish.colors.join(', ') : '-'}</p>
          <p><strong>Finishes</strong>{polish.finishes.length > 0 ? polish.finishes.join(', ') : '-'}</p>
          <p><strong>Rating</strong>{polish.rating ? formatRating(polish.rating) : '-'}</p>
          <p><strong>Coats Needed</strong>{polish.coats || '-'}</p>
          <p><strong>Total Bottles</strong>{polish.totalBottles ?? '-'}</p>
          <p><strong>Empty Bottles</strong>{polish.emptyBottles ?? '-'}</p>
          <p><strong>Is Old</strong>{polish.isOld === null ? '-' : polish.isOld ? 'Yes' : 'No'}</p>
          <p><strong>Last Used</strong>{polish.lastUsed ? new Date(polish.lastUsed).toLocaleDateString() : '-'}</p>
          <p><strong>Notes</strong>{polish.notes || '-'}</p>
          <Button onClick={() => setIsEditing(true)} $fullWidth>
            Edit Polish
          </Button>
        </div>
      </StyledDetails>
    </StyledContainer>
  );

  return isEditing ? renderEditMode() : renderViewMode();
};
