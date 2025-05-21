'use client';

import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../Button';
import { SingleSelect } from '../fields/SingleSelect';
import { MultiSelect } from '../fields/MultiSelect';
import { Input } from '../fields/Input';
import { DatePicker } from '../fields/DatePicker';
import { Rating, RATING_OPTIONS } from '@/types/rating';
import { SuccessMessage } from '@/components/SuccessMessage';
import { FaCamera } from 'react-icons/fa';
import Image from 'next/image';
import {
  StyledForm,
  StyledFormGroup,
  StyledTextarea,
  StyledButtonGroup,
  StyledFormSection,
  StyledFormRow,
  StyledDangerZone,
  StyledErrorMessage,
  StyledImageSection,
  StyledImagePreview,
  StyledImageInput,
  StyledImagePlaceholder,
  StyledImageButtonGroup
} from './index.styled';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';
import { ImagePasteZone } from '@/components/ImageSelector/ImagePasteZone';

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
  isOld: boolean | null;
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

interface FormErrors {
  brand?: string;
  name?: string;
  colors?: string;
  finishes?: string;
}

export const AddEditForm = (props: AddEditFormProps) => {
  return (
    <SuspenseBoundary>
      <AddEditFormContent {...props} />
    </SuspenseBoundary>
  );
};

function AddEditFormContent({
  initialData,
  isEditing = false,
  brands = [],
  availableColors = [],
  availableFinishes = []
}: AddEditFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const returnTo = searchParams.get('returnTo') ?? '/';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<AddEditFormData>(
    initialData || {
      brand: '',
      name: '',
      colors: [],
      finishes: [],
      isOld: isEditing ? null : false,
    }
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [_isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pastedImage, setPastedImage] = useState<string | null>(null);

  const scrollToFirstError = () => {
    const firstErrorElement = document.querySelector('[data-error="true"]');
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.brand) {
      newErrors.brand = 'Brand is required';
    }
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    if (!formData.colors.length) {
      newErrors.colors = 'At least one color is required';
    }
    if (!formData.finishes.length) {
      newErrors.finishes = 'At least one finish is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Wait for the error messages to be rendered
      setTimeout(scrollToFirstError, 100);
      return false;
    }

    return true;
  };

  const handleImageCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleTakePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
      setTimeout(() => {
        if (fileInputRef.current) {
          fileInputRef.current.removeAttribute('capture');
        }
      }, 100);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) {
        console.log('No file selected');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.error('Invalid file type:', file.type);
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        console.error('File too large:', file.size);
        alert('Image must be less than 10MB');
        return;
      }

      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Reset the file input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error handling image change:', error);
      alert('Error processing image. Please try again.');
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setImageFile(null);
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleImagePasted = (imageUrl: string) => {
    setPastedImage(imageUrl);
    setPreviewUrl(imageUrl);
    setImageFile(null); // Clear file input if pasting
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with reduced quality
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedBase64);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
    });
  };

  const formatRatingForDisplay = (rating: string): string => {
    return rating.replace('_PLUS', '+').replace('_MINUS', '-');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        // Compress image before uploading
        const compressedImage = await compressImage(imageFile);

        const uploadResponse = await fetch('/api/update-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: formData.id || 'temp',
            imageUrl: compressedImage
          }),
        });
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.data.image_url;
      } else if (pastedImage) {
        // For pasted images, create a File object and compress it
        const response = await fetch(pastedImage);
        const blob = await response.blob();
        const file = new File([blob], 'pasted-image.jpg', { type: 'image/jpeg' });
        const compressedImage = await compressImage(file);

        const uploadResponse = await fetch('/api/update-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: formData.id || 'temp',
            imageUrl: compressedImage
          }),
        });
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload pasted image');
        }
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.data.image_url;
      }
      const endpoint = isEditing ? `/api/polish/${formData.id}` : '/api/polish';
      const response = await fetch(endpoint, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageUrl: imageUrl || null
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to save nail polish');
      }
      const savedPolish = await response.json();
      setSuccessMessage(isEditing ? 'Polish updated successfully!' : 'Polish added successfully!');
      setIsSuccess(true);
      setTimeout(() => {
        if (isEditing) {
          router.push(returnTo || `/polish/${formData.id}`);
        } else {
          router.push(`/polish/${savedPolish.id}`);
        }
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error('Error saving nail polish:', error);
      alert('Failed to save nail polish. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.id) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${formData.brand} - ${formData.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/polish/${formData.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete nail polish');
      }

      setSuccessMessage('Polish deleted successfully!');
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error('Error deleting nail polish:', error);
      alert('Failed to delete nail polish. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
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
                onChange={(value) => {
                  setFormData((prev) => ({ ...prev, brand: value }));
                  if (value) {
                    setErrors((prev) => ({ ...prev, brand: undefined }));
                  }
                }}
                isBrand
              />
              {errors.brand && <StyledErrorMessage data-error="true">{errors.brand}</StyledErrorMessage>}
            </StyledFormGroup>
            <StyledFormGroup>
              <label>Name *</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(value) => {
                  setFormData((prev) => ({ ...prev, name: value }));
                  if (value) {
                    setErrors((prev) => ({ ...prev, name: undefined }));
                  }
                }}
                required
              />
              {errors.name && <StyledErrorMessage data-error="true">{errors.name}</StyledErrorMessage>}
            </StyledFormGroup>
          </StyledFormRow>
        </StyledFormSection>

        <StyledFormSection>
          <h3>Image</h3>
          <StyledImageSection>
            <ImagePasteZone onImagePasted={handleImagePasted} />
            <StyledImagePreview>
              {previewUrl && previewUrl !== 'n/a' ? (
                <Image
                  src={previewUrl}
                  alt="Polish preview"
                  fill
                  style={{ objectFit: 'contain' }}
                  unoptimized
                />
              ) : previewUrl === 'n/a' ? (
                <StyledImagePlaceholder>
                  <p>❌ Marked as no image</p>
                </StyledImagePlaceholder>
              ) : (
                <StyledImagePlaceholder>
                  <FaCamera />
                  <p>No image selected</p>
                </StyledImagePlaceholder>
              )}
            </StyledImagePreview>
            <StyledImageButtonGroup>
              <>
                {previewUrl !== 'n/a' ? (
                  <>
                    <Button
                      type="button"
                      onClick={handleImageCapture}
                      disabled={isLoading}
                    >
                      <FaCamera />
                      {previewUrl ? 'Change Image' : 'Choose from Gallery'}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleTakePhoto}
                      disabled={isLoading}
                    >
                      <FaCamera />
                      Take Photo
                    </Button>
                    {isEditing && previewUrl && previewUrl !== 'n/a' && (
                      <Button
                        type="button"
                        onClick={handleRemoveImage}
                        disabled={isLoading}
                        $variant="danger"
                      >
                        Remove Image
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      onClick={handleImageCapture}
                      disabled={isLoading}
                    >
                      <FaCamera />
                      Choose from Gallery
                    </Button>
                    <Button
                      type="button"
                      onClick={handleTakePhoto}
                      disabled={isLoading}
                    >
                      <FaCamera />
                      Take Photo
                    </Button>
                  </>
                )}
                {isEditing && previewUrl !== 'n/a' && (
                  <Button
                    type="button"
                    onClick={() => {
                      setPreviewUrl('n/a');
                      setFormData(prev => ({ ...prev, imageUrl: 'n/a' }));
                    }}
                    disabled={isLoading}
                    $variant="tertiary"
                  >
                    Mark as No Image Available
                  </Button>
                )}
              </>
            </StyledImageButtonGroup>
            <StyledImageInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </StyledImageSection>
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
                onChange={(values) => {
                  setFormData((prev) => ({ ...prev, colors: values }));
                  if (values.length > 0) {
                    setErrors((prev) => ({ ...prev, colors: undefined }));
                  }
                }}
              />
              {errors.colors && <StyledErrorMessage data-error="true">{errors.colors}</StyledErrorMessage>}
            </StyledFormGroup>
            <StyledFormGroup>
              <label>Finishes *</label>
              <MultiSelect
                values={formData.finishes}
                options={availableFinishes}
                placeholder="Select finishes"
                onChange={(values) => {
                  setFormData((prev) => ({ ...prev, finishes: values }));
                  if (values.length > 0) {
                    setErrors((prev) => ({ ...prev, finishes: undefined }));
                  }
                }}
              />
              {errors.finishes && <StyledErrorMessage data-error="true">{errors.finishes}</StyledErrorMessage>}
            </StyledFormGroup>
          </StyledFormRow>
        </StyledFormSection>

        <StyledFormSection>
          <h3>Details</h3>
          <StyledFormRow>
            <StyledFormGroup>
              <label>Rating</label>
              <SingleSelect
                value={formData.rating ? formatRatingForDisplay(formData.rating) : ''}
                options={RATING_OPTIONS.map(rating => formatRatingForDisplay(rating))}
                placeholder="Select rating"
                onChange={(value) => {
                  const originalRating = RATING_OPTIONS.find(r => formatRatingForDisplay(r) === value);
                  setFormData((prev) => ({ ...prev, rating: originalRating as Rating || undefined }));
                }}
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
              <DatePicker
                value={formData.lastUsed ? new Date(formData.lastUsed) : undefined}
                onChange={(date) => setFormData((prev) => ({ ...prev, lastUsed: date || undefined }))}
                required={false}
                placeholder="Select date"
                name="lastUsed"
              />
            </StyledFormGroup>
            <StyledFormGroup>
              <label>Is older polish?</label>
              <SingleSelect
                value={formData.isOld === null ? '' : formData.isOld ? 'Yes' : 'No'}
                options={['Yes', 'No']}
                placeholder="Select answer"
                onChange={(value) => {
                  if (value === '') {
                    setFormData((prev) => ({ ...prev, isOld: null }));
                  } else {
                    setFormData((prev) => ({ ...prev, isOld: value === 'Yes' }));
                  }
                }}
                disableSearch={true}
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

        {isEditing && (
          <StyledDangerZone>
            <h3>Danger Zone</h3>
            <p>Once you delete a polish, there is no going back. Please be certain.</p>
            <Button
              onClick={handleDelete}
              type="button"
              $variant="danger"
              disabled={isDeleting}
              $fullWidth
            >
              {isDeleting ? 'Deleting...' : 'Delete Polish'}
            </Button>
          </StyledDangerZone>
        )}
      </StyledForm>

      <SuccessMessage
        message={successMessage}
        onClose={() => setIsSuccess(false)}
      />
    </>
  );
}
