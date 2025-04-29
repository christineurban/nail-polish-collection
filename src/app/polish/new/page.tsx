import NailPolishForm from '@/components/NailPolishForm';
import { StyledContainer, StyledHeader } from './page.styled';

export default function NewPolishPage() {
  return (
    <StyledContainer>
      <StyledHeader>
        <h1>Add New Nail Polish</h1>
      </StyledHeader>
      <NailPolishForm />
    </StyledContainer>
  );
}
