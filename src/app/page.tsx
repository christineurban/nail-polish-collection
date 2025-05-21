'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { NailPolishGrid } from '@/components/NailPolishGrid';
import { Rating } from '@prisma/client';
import { StyledPagination } from '@/components/Pagination/index.styled';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';

interface Polish {
  id: string;
  brand: string;
  name: string;
  imageUrl: string | null;
  colors: string[];
  finishes: string[];
  rating: Rating | null;
}

interface ApiResponse {
  polishes: Polish[];
  total: number;
  page: number;
  totalPages: number;
}

export default function Home() {
  return (
    <SuspenseBoundary>
      <HomeContent />
    </SuspenseBoundary>
  );
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const [polishes, setPolishes] = useState<Polish[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [finishes, setFinishes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPolishes, setTotalPolishes] = useState(0);

  // Get current filters from URL (for NailPolishGrid prop)
  const currentFilters = {
    brand: searchParams.getAll('brand') || [],
    finish: searchParams.getAll('finish') || [],
    color: searchParams.getAll('color') || [],
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || '',
    rating: searchParams.getAll('rating') || [],
    hasImage: searchParams.get('hasImage') || '',
    isOld: searchParams.get('isOld') || '',
    page: searchParams.get('page') || '1',
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch('/api/options');
        if (!response.ok) throw new Error('Failed to fetch options');
        const data = await response.json();
        setBrands(data.brands);
        setColors(data.colors);
        setFinishes(data.finishes);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    // Recalculate currentFilters inside the effect
    const filters = {
      brand: searchParams.getAll('brand') || [],
      finish: searchParams.getAll('finish') || [],
      color: searchParams.getAll('color') || [],
      search: searchParams.get('search') || '',
      sort: searchParams.get('sort') || '',
      rating: searchParams.getAll('rating') || [],
      hasImage: searchParams.get('hasImage') || '',
      isOld: searchParams.get('isOld') || '',
      page: searchParams.get('page') || '1',
    };

    const fetchPolishes = async () => {
      try {
        setIsLoading(true);
        // Build the query string from filters
        const params = new URLSearchParams();
        if (filters.search) params.set('search', filters.search);
        if (filters.hasImage) params.set('hasImage', filters.hasImage);
        if (filters.isOld) params.set('isOld', filters.isOld);
        if (filters.brand.length > 0) {
          filters.brand.forEach(brand => params.append('brand', brand));
        }
        if (filters.finish.length > 0) {
          filters.finish.forEach(finish => params.append('finish', finish));
        }
        if (filters.color.length > 0) {
          filters.color.forEach(color => params.append('color', color));
        }
        if (filters.rating.length > 0) {
          filters.rating.forEach(rating => params.append('rating', rating));
        }
        params.set('page', filters.page);
        params.set('limit', '45');

        const response = await fetch(`/api/polishes?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch polishes');
        const data: ApiResponse = await response.json();

        if (!data || !data.polishes || !Array.isArray(data.polishes)) {
          throw new Error('Invalid data format received from API');
        }

        setPolishes(data.polishes);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
        setTotalPolishes(data.total);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(fetchPolishes, 500);
    return () => clearTimeout(timeoutId);
  }, [searchParams]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('page', newPage.toString());
    router.push(`/?${params.toString()}`);
  };

  return (
    <>
      <PageHeader
        title="All Nail Polishes"
        description="Browse, filter, and sort below ⬇"
      />
      <NailPolishGrid
        polishes={polishes}
        brands={brands}
        colors={colors}
        finishes={finishes}
        currentFilters={currentFilters}
        totalPolishes={totalPolishes}
      />
      {!isLoading && !error && (
        <StyledPagination>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            Next
          </button>
        </StyledPagination>
      )}
      {error && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
          {error}
        </div>
      )}
    </>
  );
}
