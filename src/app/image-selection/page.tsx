'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ImageSelector } from '@/components/ImageSelector';
import { PageHeader } from '@/components/PageHeader';
import {
  StyledPagination,
  StyledPaginationButton,
  StyledPaginationInfo
} from './page.styled';

interface Polish {
  id: string;
  name: string;
  link: string | null;
  imageUrl: string | null;
  brand: string;
}

interface PaginatedResponse {
  polishes: Polish[];
  total: number;
  page: number;
  totalPages: number;
}

export default function ImageSelectionPage() {
  const router = useRouter();
  const [polishes, setPolishes] = useState<Polish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchPolishes = async () => {
    try {
      const response = await fetch(`/api/polishes?hasImage=false&page=${currentPage}&limit=10`);
      if (!response.ok) throw new Error('Failed to fetch polish details');
      const data: PaginatedResponse = await response.json();
      setPolishes(data.polishes);
      setTotalPages(data.totalPages);
      setTotalItems(data.total);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPolishes();
  }, [currentPage]);

  const handleImageSaved = async (id: string) => {
    // Remove the saved polish from the current page
    setPolishes(prevPolishes => prevPolishes.filter(p => p.id !== id));

    // If this was the last polish on the page and not the first page, go to previous page
    if (polishes.length === 1 && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    } else {
      // Refetch the data to get the updated list
      await fetchPolishes();
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
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
      <StyledPagination>
        <StyledPaginationInfo>
          Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalItems)} of {totalItems} polishes
        </StyledPaginationInfo>
        <div>
          <StyledPaginationButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </StyledPaginationButton>
          <StyledPaginationButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </StyledPaginationButton>
        </div>
      </StyledPagination>
    </>
  );
}
