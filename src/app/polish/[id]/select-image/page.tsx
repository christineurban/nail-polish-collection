'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { MainContainer } from '@/components/MainContainer';
import { ImageSelector } from '@/components/ImageSelector';
import { PageHeader } from '@/components/PageHeader';

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
        const response = await fetch(`/api/polishes/${params.id}`);
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
      <MainContainer>
        <PageHeader title="Loading..." />
      </MainContainer>
    );
  }

  if (error || !polish) {
    return (
      <MainContainer>
        <PageHeader
          title="Error"
          description={error || 'Polish not found'}
        />
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <PageHeader
        title={`Select Image for ${polish.brand} ${polish.name}`}
        description='Click on an image to select it, then click "Save" to update the database.'
      />
      <ImageSelector
        polish={polish}
        onImageSaved={handleImageSaved}
      />
    </MainContainer>
  );
}
