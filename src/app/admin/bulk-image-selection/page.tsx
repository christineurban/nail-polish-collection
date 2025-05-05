'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { StyledContainer } from './page.styled';
import { Button } from '@/components/Button';
import { MatchedImageCard } from '@/components/MatchedImageCard';

interface Polish {
  id: string;
  name: string;
  brand: string;
  imageUrl: string | null;
}

interface ImageMatch {
  imageUrl: string;
  brand: string;
  name: string;
  matchedPolish: Polish | null;
  isConfirmed: boolean;
}

export default function BulkImageSelectionPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<ImageMatch[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const googleSheetUrls = [
    'https://docs.google.com/spreadsheets/d/1nBEVvW4ha8aP_Fss-eVZKpi9THKsln8o5CIOfhrjC7M/edit?gid=1357444575#gid=1357444575',
    'https://docs.google.com/spreadsheets/d/1nBEVvW4ha8aP_Fss-eVZKpi9THKsln8o5CIOfhrjC7M/edit?gid=889736888#gid=889736888',
    'https://docs.google.com/spreadsheets/d/1nBEVvW4ha8aP_Fss-eVZKpi9THKsln8o5CIOfhrjC7M/edit?gid=2098121698#gid=2098121698',
    'https://docs.google.com/spreadsheets/d/1nBEVvW4ha8aP_Fss-eVZKpi9THKsln8o5CIOfhrjC7M/edit?gid=1373751079#gid=1373751079'
  ];

  const fetchAndMatchImages = async () => {
    try {
      setIsLoading(true);

      // Fetch polishes without images
      const polishesResponse = await fetch('/api/polishes?hasImage=false&limit=1000');
      if (!polishesResponse.ok) throw new Error('Failed to fetch polish details');
      const polishesData = await polishesResponse.json();
      const polishes = polishesData.polishes;

      // Fetch images from Google Sheets
      const imagesResponse = await fetch('/api/fetch-bulk-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urls: googleSheetUrls
        }),
      });

      if (!imagesResponse.ok) throw new Error('Failed to fetch images');
      const imagesData = await imagesResponse.json();

      // Match images with polishes
      const newMatches = imagesData.images.map((image: { url: string; brand: string; name: string }) => {
        // Find matching polish by brand and name
        const matchedPolish = polishes.find((polish: Polish) =>
          polish.brand.toLowerCase() === image.brand.toLowerCase() &&
          polish.name.toLowerCase() === image.name.toLowerCase()
        );

        return {
          imageUrl: image.url,
          brand: image.brand,
          name: image.name,
          matchedPolish: matchedPolish || null,
          isConfirmed: false
        };
      }).filter((match: ImageMatch) => match.matchedPolish !== null);

      setMatches(newMatches);
    } catch (error) {
      console.error('Error fetching and matching:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmToggle = (index: number) => {
    setMatches(prevMatches => prevMatches.map((match, i) =>
      i === index ? { ...match, isConfirmed: !match.isConfirmed } : match
    ));
  };

  const handleSaveConfirmed = async () => {
    const confirmedMatches = matches.filter(match => match.isConfirmed);
    if (confirmedMatches.length === 0) return;

    try {
      setIsSaving(true);

      // Update each confirmed match
      await Promise.all(confirmedMatches.map(match =>
        fetch('/api/update-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: match.matchedPolish!.id,
            imageUrl: match.imageUrl
          }),
        })
      ));

      // Refresh matches
      await fetchAndMatchImages();
    } catch (error) {
      console.error('Error saving matches:', error);
      setError(error instanceof Error ? error.message : 'Failed to save matches');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchAndMatchImages();
  }, []);

  if (isLoading) {
    return (
      <StyledContainer>
        <PageHeader title="Loading..." />
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer>
        <PageHeader
          title="Error"
          description={error}
        />
      </StyledContainer>
    );
  }

  const confirmedCount = matches.filter(match => match.isConfirmed).length;

  return (
    <StyledContainer>
      <PageHeader
        title="Bulk Image Selection"
        description="Review and confirm automatically matched images for polishes."
      />

      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          Found {matches.length} potential matches
          {confirmedCount > 0 && ` (${confirmedCount} confirmed)`}
        </div>
        <Button
          onClick={handleSaveConfirmed}
          disabled={confirmedCount === 0 || isSaving}
        >
          {isSaving ? 'Saving...' : `Save ${confirmedCount} Confirmed Matches`}
        </Button>
      </div>

      {matches.length === 0 ? (
        <div>No matches found between Google Sheets and polishes without images.</div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {matches.map((match, index) => (
            <MatchedImageCard
              key={`${match.matchedPolish!.id}-${match.imageUrl}`}
              match={match}
              onConfirmToggle={() => handleConfirmToggle(index)}
            />
          ))}
        </div>
      )}
    </StyledContainer>
  );
}
