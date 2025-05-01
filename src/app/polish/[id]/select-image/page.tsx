'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ImageSelector } from '@/components/ImageSelector';
import { PageHeader } from '@/components/PageHeader';
import Link from 'next/link';
import {
  StyledErrorContainer,
  StyledErrorMessage,
  StyledLink,
  StyledLinkContainer,
  StyledDivider
} from './page.styled';

interface Polish {
  id: string;
  name: string;
  link: string | null;
  imageUrl: string | null;
  brand: string;
}

export default function SelectImagePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [polish, setPolish] = useState<Polish | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolish = async () => {
      try {
        const response = await fetch(`/api/polish/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch polish details');
        const data = await response.json();
        setPolish(data);
      } catch (error) {
        console.error('Error fetching polish:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolish();
  }, [params.id]);

  const handleImageSaved = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <PageHeader title="Loading..." />
    );
  }

  if (error || !polish) {
    return (
      <div>
        <PageHeader
          title="Error"
          description={error || 'Polish not found'}
        />
        <StyledLink href="/">
          Return to Home
        </StyledLink>
      </div>
    );
  }

  if (!polish.link) {
    return (
      <div>
        <PageHeader
          title={`${polish.brand} ${polish.name}`}
          description="No source link available"
        />
        <StyledErrorMessage>
          {"To select images for this polish, you need to add a link to a "
          + "website that has images of the polish first."}
        </StyledErrorMessage>
        <StyledLinkContainer>
          <div>{"You can either:"}</div>
          <StyledLink href={`/polish/${params.id}/edit`}>
            Go to Edit Page to add a link
          </StyledLink>
          <div>or</div>
          <StyledLink href="/">
            Return to Home
          </StyledLink>
        </StyledLinkContainer>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={`Select Image for ${polish.brand} ${polish.name}`}
        description='Click on an image to select it, then click "Save" to update the database.'
      />
      <ImageSelector
        polish={polish}
        onImageSaved={handleImageSaved}
      />
    </>
  );
}
