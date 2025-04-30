'use client';

import styled from 'styled-components';

const StyledContainer = styled.div`
  width: 100%;
`;

const StyledHeader = styled.div`
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: #2D3748;
    margin: 0;
    line-height: 1.2;
  }

  p {
    margin-top: 0.5rem;
    color: #718096;
    font-size: 1.125rem;
  }
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
      <StyledHeader>
        <h1>Image Gallery</h1>
        <p>Browse and select images for your nail polish collection</p>
      </StyledHeader>
      <StyledGrid>
        {/* Image selection content will go here */}
      </StyledGrid>
    </StyledContainer>
  );
}
