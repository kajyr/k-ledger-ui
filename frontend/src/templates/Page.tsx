import React, { FC } from 'react';
import styled from 'styled-components';

const Main = styled.main`
  display: flex;
  min-height: 100vh;
`;

const Body = styled.div`
  padding: 1em;
  flex: 1;
  background: #ecf0f5;
`;

const Page: FC = ({ children }) => (
  <Main>
    <Body>{children}</Body>
  </Main>
);

export default Page;
