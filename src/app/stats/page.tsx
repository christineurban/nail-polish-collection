'use client';

import { useEffect, useState } from 'react';
import { StatsTable } from '@/components/StatsTable';
import { Tabs } from '@/components/Tabs';
import { PageHeader } from '@/components/PageHeader';
import { StyledStatsContainer, StyledTotalStats } from './page.styled';
import { CollectionStats } from '@/types/stats';

export default function StatsPage() {
  const [stats, setStats] = useState<CollectionStats>({
    totalPolishes: 0,
    totalBrands: 0,
    brandStats: [],
    colorStats: [],
    finishStats: []
  });
  const [activeTab, setActiveTab] = useState('brands');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const tabs = [
    {
      id: 'brands',
      label: 'Brands',
      content: <StatsTable title="Brands" stats={stats.brandStats} />
    },
    {
      id: 'colors',
      label: 'Colors',
      content: <StatsTable title="Colors" stats={stats.colorStats} />
    },
    {
      id: 'finishes',
      label: 'Finishes',
      content: <StatsTable title="Finishes" stats={stats.finishStats} />
    }
  ];

  if (isLoading) {
    return (
      <StyledStatsContainer>
        <PageHeader title="Loading statistics..." />
      </StyledStatsContainer>
    );
  }

  if (error) {
    return (
      <StyledStatsContainer>
        <PageHeader
          title="Error loading statistics"
          description={error}
        />
      </StyledStatsContainer>
    );
  }

  return (
    <StyledStatsContainer>
      <PageHeader title="Collection Statistics" />

      <StyledTotalStats>
        <div>
          <h3>Total Polishes</h3>
          <p>{stats.totalPolishes}</p>
        </div>
        <div>
          <h3>Total Brands</h3>
          <p>{stats.totalBrands}</p>
        </div>
      </StyledTotalStats>

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </StyledStatsContainer>
  );
}
