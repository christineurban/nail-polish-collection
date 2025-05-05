'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { StyledStatsGrid, StyledStatCard } from './page.styled';

interface Stats {
  totalPolishes: number;
  totalBrands: number;
  totalColors: number;
  totalFinishes: number;
  averageRating: number;
  mostCommonBrand: {
    name: string;
    count: number;
  };
  mostCommonColor: {
    name: string;
    count: number;
  };
  mostCommonFinish: {
    name: string;
    count: number;
  };
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        setError('Failed to load statistics');
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <PageHeader title="Loading..." />;
  }

  if (error) {
    return <PageHeader title="Error" description={error} />;
  }

  if (!stats) {
    return <PageHeader title="No data available" />;
  }

  return (
    <>
      <PageHeader
        title="Collection Statistics"
        description="Overview and insights about your nail polish collection"
      />
      <StyledStatsGrid>
        <StyledStatCard>
          <h3>Total Polishes</h3>
          <div className="value">{stats.totalPolishes}</div>
          <div className="description">Polishes in your collection</div>
        </StyledStatCard>

        <StyledStatCard>
          <h3>Brands</h3>
          <div className="value">{stats.totalBrands}</div>
          <div className="description">Different brands collected</div>
        </StyledStatCard>

        <StyledStatCard>
          <h3>Colors</h3>
          <div className="value">{stats.totalColors}</div>
          <div className="description">Unique colors in collection</div>
        </StyledStatCard>

        <StyledStatCard>
          <h3>Finishes</h3>
          <div className="value">{stats.totalFinishes}</div>
          <div className="description">Different finishes available</div>
        </StyledStatCard>

        <StyledStatCard>
          <h3>Average Rating</h3>
          <div className="value">{stats.averageRating ? stats.averageRating.toFixed(1) : 'N/A'}</div>
          <div className="description">Average polish rating</div>
        </StyledStatCard>

        <StyledStatCard>
          <h3>Most Popular Brand</h3>
          <div className="value">{stats.mostCommonBrand.name}</div>
          <div className="description">{stats.mostCommonBrand.count} polishes</div>
        </StyledStatCard>

        <StyledStatCard>
          <h3>Most Common Color</h3>
          <div className="value">{stats.mostCommonColor.name}</div>
          <div className="description">{stats.mostCommonColor.count} polishes</div>
        </StyledStatCard>

        <StyledStatCard>
          <h3>Most Common Finish</h3>
          <div className="value">{stats.mostCommonFinish.name}</div>
          <div className="description">{stats.mostCommonFinish.count} polishes</div>
        </StyledStatCard>
      </StyledStatsGrid>
    </>
  );
}
