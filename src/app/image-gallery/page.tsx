'use client';

import styled from 'styled-components';
import { PageHeader } from '@/components/PageHeader';

const StyledContainer = styled.div`
  width: 100%;
`;

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

export default function ImageGallery() {
  return (
    <StyledContainer>
      <PageHeader
        title="Image Gallery"
        description="Browse and select images for your nail polish collection"
      />
      <StyledGrid>
        {/* Image selection content will go here */}
      </StyledGrid>
    </StyledContainer>
  );
}
