'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ImageSelector } from '@/components/ImageSelector';
import { PageHeader } from '@/components/PageHeader';

interface Polish {
  id: string;
  name: string;
  link: string | null;
  imageUrl: string | null;
  brand: string;
}

export default function SelectImagesPage() {
  const router = useRouter();
  const [polishes, setPolishes] = useState<Polish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolishes = async () => {
      try {
        const response = await fetch('/api/polishes?hasImage=false');
        if (!response.ok) throw new Error('Failed to fetch polish details');
        const data = await response.json();
        setPolishes(data);
      } catch (error) {
        console.error('Error fetching polishes:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolishes();
  }, []);

  const handleImageSaved = (id: string) => {
    // No redirection needed - we want to stay on this page
    // The success message will be shown and fade away
  };

  if (isLoading) {
    return (
      <PageHeader title="Loading..." />
    );
  }

  if (error) {
    return (
      <PageHeader
        title="Error"
        description={error}
      />
    );
  }

  if (polishes.length === 0) {
    return (
      <PageHeader
        title="No Polishes Need Images"
        description="All polishes in your collection have images."
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Select Images"
        description='Click on an image to select it, then click "Save" to update the database.'
      />
      {polishes.map(polish => (
        <ImageSelector
          key={polish.id}
          polish={polish}
          onImageSaved={() => handleImageSaved(polish.id)}
        />
      ))}
    </>
  );
}
