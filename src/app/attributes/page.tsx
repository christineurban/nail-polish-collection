'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Tabs } from '@/components/Tabs';
import { StyledAttributeList, StyledAttributeCard } from './page.styled';

interface Attribute {
  name: string;
  count: number;
}

export default function AttributesPage() {
  const [colors, setColors] = useState<Attribute[]>([]);
  const [finishes, setFinishes] = useState<Attribute[]>([]);
  const [brands, setBrands] = useState<Attribute[]>([]);
  const [activeTab, setActiveTab] = useState('colors');

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await fetch('/api/attributes');
        const data = await response.json();
        setColors(data.colors);
        setFinishes(data.finishes);
        setBrands(data.brands);
      } catch (error) {
        console.error('Failed to fetch attributes:', error);
      }
    };

    fetchAttributes();
  }, []);

  const tabs = [
    {
      id: 'colors',
      label: 'Colors',
      content: (
        <StyledAttributeList>
          {colors.map((color) => (
            <StyledAttributeCard key={color.name}>
              <h3>{color.name}</h3>
              <span>{color.count} polishes</span>
            </StyledAttributeCard>
          ))}
        </StyledAttributeList>
      ),
    },
    {
      id: 'finishes',
      label: 'Finishes',
      content: (
        <StyledAttributeList>
          {finishes.map((finish) => (
            <StyledAttributeCard key={finish.name}>
              <h3>{finish.name}</h3>
              <span>{finish.count} polishes</span>
            </StyledAttributeCard>
          ))}
        </StyledAttributeList>
      ),
    },
    {
      id: 'brands',
      label: 'Brands',
      content: (
        <StyledAttributeList>
          {brands.map((brand) => (
            <StyledAttributeCard key={brand.name}>
              <h3>{brand.name}</h3>
              <span>{brand.count} polishes</span>
            </StyledAttributeCard>
          ))}
        </StyledAttributeList>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Attributes"
        description="View all colors, finishes, and brands in your collection"
      />
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </>
  );
}
