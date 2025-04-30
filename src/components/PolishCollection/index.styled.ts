import styled from 'styled-components';

export const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
`;

export const StyledEmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  grid-column: 1 / -1;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 1rem;
  }

  p {
    color: #4a5568;
    margin-bottom: 2rem;
  }
`;
