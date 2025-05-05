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
  StyledMessage
} from './page.styled';

interface Attribute {
  id: string;
  name: string;
  count: number;
}

type SortOrder = 'name-asc' | 'name-desc' | 'count-asc' | 'count-desc';

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

  const getAttributeList = (type: 'colors' | 'finishes' | 'brands') => {
    const attributes = type === 'colors' ? colors : type === 'finishes' ? finishes : brands;
    const filteredAndSorted = filterAttributes(sortAttributes(attributes));
    const attributeType = singularForms[type] as 'color' | 'finish' | 'brand';

    return (
      <>
        <StyledAddForm onSubmit={(e) => handleAdd(e, attributeType)}>
          <Input
            placeholder={`Add new ${attributeType}...`}
            value={newAttributeName}
            onChange={setNewAttributeName}
            aria-label={`Add new ${attributeType}`}
          />
          <Button type="submit">
            Add {attributeType}
          </Button>
        </StyledAddForm>

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

        <div style={{ maxWidth: '300px', marginBottom: '1rem' }}>
          <Input
            placeholder={`Search ${type}...`}
            value={searchTerm}
            onChange={setSearchTerm}
            aria-label={`Search ${type}`}
          />
        </div>

        <StyledAttributeList>
          {filteredAndSorted.map((attr) => (
            <StyledAttributeCard key={attr.id}>
              <h3>{attr.name}</h3>
              <span>{attr.count} polishes</span>
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
