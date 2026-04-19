/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
}

const StyledLabel = styled.label`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #8b8fa8;
`;

export function Label({ children, htmlFor }: LabelProps) {
  return <StyledLabel htmlFor={htmlFor}>{children}</StyledLabel>;
}
