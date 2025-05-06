'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import {
  StyledStatsGrid,
  StyledAttributeList,
  StyledSortControls,
  StyledSortButton,
  StyledAddForm,
  StyledMessage,
  StyledViewControls,
  StyledViewButton,
  StyledInputContainer,
  StyledSectionHeading,
  StyledInputControls,
  StyledNote
} from './page.styled';
import { BsGrid, BsTable } from 'react-icons/bs';
import { Table } from '@/components/Table';
import { Tabs } from '@/components/Tabs';
import { Input } from '@/components/fields/Input';
import { Button } from '@/components/Button';
import { Tile } from '@/components/Tile';

interface Stats {
  totalPolishes: number;
  totalBrands: number;
  totalColors: number;
  totalFinishes: number;
  mostPopularNewBrand: {
    name: string;
    count: number;
  };
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

interface Attribute {
  id: string;
  name: string;
  count: number;
  percentage: number;
}

type SortOrder = 'name-asc' | 'name-desc' | 'count-asc' | 'count-desc';
type ViewMode = 'card' | 'table';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [colors, setColors] = useState<Attribute[]>([]);
  const [finishes, setFinishes] = useState<Attribute[]>([]);
  const [brands, setBrands] = useState<Attribute[]>([]);
  const [selectedAttribute, setSelectedAttribute] = useState<'brands' | 'colors' | 'finishes' | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('name-asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const [newAttributeName, setNewAttributeName] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('card');

  const singularForms = {
    colors: 'color',
    finishes: 'finish',
    brands: 'brand'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, attributesResponse] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/attributes')
        ]);

        const statsData = await statsResponse.json();
        const attributesData = await attributesResponse.json();

        setStats(statsData);
        setColors(attributesData.colors);
        setFinishes(attributesData.finishes);
        setBrands(attributesData.brands);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string, type: 'color' | 'finish' | 'brand') => {
    try {
      const response = await fetch('/api/attributes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete attribute');
      }

      const fetchAttributes = async () => {
        const response = await fetch('/api/attributes');
        const data = await response.json();
        setColors(data.colors);
        setFinishes(data.finishes);
        setBrands(data.brands);
      };

      fetchAttributes();
    } catch (error: any) {
      console.error('Error deleting attribute:', error);
      setError(error.message);
    }
  };

  const handleAdd = async (e: React.FormEvent, type: 'color' | 'finish' | 'brand') => {
    e.preventDefault();

    if (!newAttributeName.trim()) {
      setError('Name cannot be empty');
      setSuccess(null);
      return;
    }

    try {
      const response = await fetch('/api/attributes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          name: newAttributeName.trim()
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add attribute');
      }

      const singularType = singularForms[`${type}s` as keyof typeof singularForms];
      setNewAttributeName('');
      setError(null);
      setSuccess(`Successfully added ${singularType}: ${newAttributeName}`);
      setTimeout(() => setSuccess(null), 3000);

      const fetchAttributes = async () => {
        const response = await fetch('/api/attributes');
        const data = await response.json();
        setColors(data.colors);
        setFinishes(data.finishes);
        setBrands(data.brands);
      };

      fetchAttributes();
    } catch (error: any) {
      console.error('Error adding attribute:', error);
      setError(error.message);
      setSuccess(null);
    }
  };

  const sortAttributes = (attributes: Attribute[]): Attribute[] => {
    return [...attributes].sort((a, b) => {
      switch (sortOrder) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'count-asc':
          return a.count - b.count;
        case 'count-desc':
          return b.count - a.count;
        default:
          return 0;
      }
    });
  };

  const filterAttributes = (attributes: Attribute[]): Attribute[] => {
    if (!searchTerm) return attributes;
    const term = searchTerm.toLowerCase();
    return attributes.filter(attr =>
      attr.name.toLowerCase().includes(term)
    );
  };

  const renderTable = (attributes: Attribute[], attributeType: 'color' | 'finish' | 'brand') => {
    console.log('Rendering table for:', attributeType, attributes);
    const columns = [
      {
        header: 'Name',
        key: 'name' as const,
        sortable: true
      },
      {
        header: 'Count',
        key: 'count' as const,
        sortable: true,
        render: (item: Attribute) => {
          console.log('Table row item:', item.name, 'Count:', item.count);
          return `${item.count} ${item.count === 1 ? 'polish' : 'polishes'}`;
        }
      },
      {
        header: 'Percentage',
        key: 'percentage' as const,
        sortable: true,
        render: (item: Attribute) => `${item.percentage.toFixed(1)}%`
      },
      {
        header: 'Actions',
        key: 'id' as const,
        render: (item: Attribute) => Number(item.count) <= 0 && (
          <Button
            onClick={() => handleDelete(item.id, attributeType)}
            $variant="danger"
            $size="small"
          >
            Delete
          </Button>
        )
      }
    ];

    const handleSort = (field: string) => {
      const newOrder = field === 'name'
        ? sortOrder === 'name-asc' ? 'name-desc' : 'name-asc'
        : field === 'count'
        ? sortOrder === 'count-asc' ? 'count-desc' : 'count-asc'
        : sortOrder;
      setSortOrder(newOrder as SortOrder);
    };

    const getSortDirection = (field: string) => {
      if (field === 'name' && (sortOrder === 'name-asc' || sortOrder === 'name-desc')) {
        return sortOrder === 'name-asc' ? 'asc' : 'desc';
      }
      if (field === 'count' && (sortOrder === 'count-asc' || sortOrder === 'count-desc')) {
        return sortOrder === 'count-asc' ? 'asc' : 'desc';
      }
      return undefined;
    };

    const getSortField = () => {
      if (sortOrder.startsWith('name-')) return 'name';
      if (sortOrder.startsWith('count-')) return 'count';
      return undefined;
    };

    return (
      <Table
        data={attributes}
        columns={columns}
        sortField={getSortField()}
        sortDirection={getSortDirection(getSortField() || '')}
        onSort={handleSort}
      />
    );
  };

  const renderCards = (attributes: Attribute[], attributeType: 'color' | 'finish' | 'brand') => {
    return (
      <StyledAttributeList>
        {attributes.map(attr => (
          <div key={attr.id}>
            <Tile
              title={attr.name}
              value={`${attr.count} ${attr.count === 1 ? 'polish' : 'polishes'} (${attr.percentage.toFixed(1)}%)`}
              variant="attribute"
              showDelete={attr.count === 0}
              onDelete={() => handleDelete(attr.id, attributeType)}
            />
          </div>
        ))}
      </StyledAttributeList>
    );
  };

  const handleStatClick = (type: 'brands' | 'colors' | 'finishes') => {
    setSelectedAttribute(selectedAttribute === type ? null : type);
    setNewAttributeName('');
    setError(null);
    setSuccess(null);
    setSortOrder('name-asc');
    setSearchTerm('');
  };

  const getAttributeList = (type: 'colors' | 'finishes' | 'brands') => {
    const attributes = type === 'colors' ? colors : type === 'finishes' ? finishes : brands;
    const filteredAndSorted = filterAttributes(sortAttributes(attributes));
    const attributeType = singularForms[type] as 'color' | 'finish' | 'brand';

    return (
      <>
        <StyledViewControls>
          <StyledViewButton
            onClick={() => setViewMode('card')}
            $isActive={viewMode === 'card'}
          >
            <BsGrid /> Cards
          </StyledViewButton>
          <StyledViewButton
            onClick={() => setViewMode('table')}
            $isActive={viewMode === 'table'}
          >
            <BsTable /> Table
          </StyledViewButton>
        </StyledViewControls>

        <StyledSortControls>
          <StyledSortButton
            onClick={() => setSortOrder('name-asc')}
            $isActive={sortOrder === 'name-asc'}
          >
            Name ↑
          </StyledSortButton>
          <StyledSortButton
            onClick={() => setSortOrder('name-desc')}
            $isActive={sortOrder === 'name-desc'}
          >
            Name ↓
          </StyledSortButton>
          <StyledSortButton
            onClick={() => setSortOrder('count-desc')}
            $isActive={sortOrder === 'count-desc'}
          >
            Count ↑
          </StyledSortButton>
          <StyledSortButton
            onClick={() => setSortOrder('count-asc')}
            $isActive={sortOrder === 'count-asc'}
          >
            Count ↓
          </StyledSortButton>
        </StyledSortControls>

        <StyledInputControls>
          <StyledInputContainer>
            <Input
              placeholder={`Search ${type}...`}
              value={searchTerm}
              onChange={setSearchTerm}
              aria-label={`Search ${type}`}
            />
          </StyledInputContainer>

          <StyledAddForm onSubmit={(e) => handleAdd(e, attributeType)}>
            <StyledInputContainer>
              <Input
                placeholder={`Add new ${attributeType}...`}
                value={newAttributeName}
                onChange={setNewAttributeName}
                aria-label={`Add new ${attributeType}`}
              />
            </StyledInputContainer>
            <Button type="submit">
              Add {attributeType}
            </Button>
          </StyledAddForm>
        </StyledInputControls>

        {viewMode === 'card'
          ? renderCards(filteredAndSorted, attributeType)
          : renderTable(filteredAndSorted, attributeType)
        }

        <StyledNote>
          Note: A {attributeType} can only be deleted if there are no polishes associated with it
        </StyledNote>
      </>
    );
  };

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
        title="Dashboard"
        description="Click on a tile to view and manage details"
      />
      <StyledStatsGrid>
        <Tile
          title="Total Polishes"
          value={stats.totalPolishes}
          description="Polishes in your collection"
          onClick={() => router.push('/')}
        />

        <Tile
          title="Brands"
          value={stats.totalBrands}
          description="Different brands collected"
          onClick={() => handleStatClick('brands')}
          $isActive={selectedAttribute === 'brands'}
        />

        <Tile
          title="Colors"
          value={stats.totalColors}
          description="Unique colors in collection"
          onClick={() => handleStatClick('colors')}
          $isActive={selectedAttribute === 'colors'}
        />

        <Tile
          title="Finishes"
          value={stats.totalFinishes}
          description="Different finishes available"
          onClick={() => handleStatClick('finishes')}
          $isActive={selectedAttribute === 'finishes'}
        />

        <Tile
          title="Top New Brand"
          value={stats.mostPopularNewBrand.name}
          description={`${stats.mostPopularNewBrand.count} polishes`}
        />

        <Tile
          title="Most Popular Brand"
          value={stats.mostCommonBrand.name}
          description={`${stats.mostCommonBrand.count} polishes`}
        />

        <Tile
          title="Most Common Color"
          value={stats.mostCommonColor.name}
          description={`${stats.mostCommonColor.count} polishes`}
        />

        <Tile
          title="Most Common Finish"
          value={stats.mostCommonFinish.name}
          description={`${stats.mostCommonFinish.count} polishes`}
        />
      </StyledStatsGrid>

      {error && (
        <StyledMessage $type="error">{error}</StyledMessage>
      )}
      {success && (
        <StyledMessage $type="success">{success}</StyledMessage>
      )}
      {selectedAttribute && (
        <>
          <StyledSectionHeading>
            {selectedAttribute === 'brands' ? 'Brand Details' :
             selectedAttribute === 'colors' ? 'Color Details' :
             'Finish Details'}
          </StyledSectionHeading>
          {getAttributeList(selectedAttribute)}
        </>
      )}
    </>
  );
}
