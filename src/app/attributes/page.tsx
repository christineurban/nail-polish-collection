'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Tabs } from '@/components/Tabs';
import { Input } from '@/components/fields/Input';
import { Button } from '@/components/Button';
import {
  StyledAttributeList,
  StyledAttributeCard,
  StyledDeleteButton,
  StyledSortControls,
  StyledSortButton,
  StyledAddForm,
  StyledMessage,
  StyledViewControls,
  StyledViewButton,
  StyledTable,
  StyledTableHeader,
  StyledTableCell,
  StyledTableRow,
  StyledInputContainer
} from './page.styled';
import { BsGrid, BsTable } from 'react-icons/bs';
import { Table } from '@/components/Table';

interface Attribute {
  id: string;
  name: string;
  count: number;
  percentage: number;
}

type SortOrder = 'name-asc' | 'name-desc' | 'count-asc' | 'count-desc';
type ViewMode = 'card' | 'table';

export default function AttributesPage() {
  const [colors, setColors] = useState<Attribute[]>([]);
  const [finishes, setFinishes] = useState<Attribute[]>([]);
  const [brands, setBrands] = useState<Attribute[]>([]);
  const [activeTab, setActiveTab] = useState('brands');
  const [sortOrder, setSortOrder] = useState<SortOrder>('name-asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newAttributeName, setNewAttributeName] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('card');

  const singularForms = {
    colors: 'color',
    finishes: 'finish',
    brands: 'brand'
  };

  const fetchAttributes = async () => {
    try {
      const response = await fetch('/api/attributes');
      const data = await response.json();
      setColors(data.colors);
      setFinishes(data.finishes);
      setBrands(data.brands);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch attributes:', error);
      setError('Failed to fetch attributes');
    }
  };

  useEffect(() => {
    fetchAttributes();
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
    const columns = [
      { header: 'Name', key: 'name' as const, sortable: true },
      {
        header: 'Count',
        key: 'count' as const,
        sortable: true,
        render: (item: Attribute) => `${item.count} ${item.count === 1 ? 'polish' : 'polishes'}`
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
        render: (item: Attribute) =>
          item.count === 0 && (
            <StyledDeleteButton
              onClick={() => handleDelete(item.id, attributeType)}
            >
              Delete
            </StyledDeleteButton>
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

  const renderCards = (attributes: Attribute[], attributeType: 'color' | 'finish' | 'brand') => (
    <StyledAttributeList>
      {attributes.map((attr) => (
        <StyledAttributeCard key={attr.id}>
          <h3>{attr.name}</h3>
          <span>
            {attr.count} {attr.count === 1 ? 'polish' : 'polishes'} ({attr.percentage.toFixed(1)}%)
          </span>
          {attr.count === 0 && (
            <StyledDeleteButton
              onClick={() => handleDelete(attr.id, attributeType)}
            >
              Delete
            </StyledDeleteButton>
          )}
        </StyledAttributeCard>
      ))}
    </StyledAttributeList>
  );

  const getAttributeList = (type: 'colors' | 'finishes' | 'brands') => {
    const attributes = type === 'colors' ? colors : type === 'finishes' ? finishes : brands;
    const filteredAndSorted = filterAttributes(sortAttributes(attributes));
    const attributeType = singularForms[type] as 'color' | 'finish' | 'brand';

    return (
      <>
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

        <StyledInputContainer>
          <Input
            placeholder={`Search ${type}...`}
            value={searchTerm}
            onChange={setSearchTerm}
            aria-label={`Search ${type}`}
          />
        </StyledInputContainer>

        {viewMode === 'card'
          ? renderCards(filteredAndSorted, attributeType)
          : renderTable(filteredAndSorted, attributeType)
        }
      </>
    );
  };

  const tabs = [
    {
      id: 'brands',
      label: 'Brands',
      content: getAttributeList('brands'),
    },
    {
      id: 'colors',
      label: 'Colors',
      content: getAttributeList('colors'),
    },
    {
      id: 'finishes',
      label: 'Finishes',
      content: getAttributeList('finishes'),
    },
  ];

  return (
    <>
      <PageHeader
        title="Attributes"
        description="View all colors, finishes, and brands in your collection"
      />
      {error && (
        <StyledMessage $type="error">{error}</StyledMessage>
      )}
      {success && (
        <StyledMessage $type="success">{success}</StyledMessage>
      )}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setNewAttributeName('');
          setError(null);
          setSuccess(null);
        }}
      />
    </>
  );
}
