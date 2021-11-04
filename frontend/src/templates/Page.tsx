import React, { FC } from 'react';
import styled from 'styled-components';

import { Title } from '@mantine/core';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  header {
    margin-bottom: 15px;
  }
`;

const Body = styled.main`
  flex: 1;
`;

const Page: FC<{ filename: string }> = ({ filename, children }) => (
  <Wrapper>
    <header>
      <Title order={1}>kLedger UI</Title>
      <div>File in use: {filename}</div>
    </header>
    <Body>{children}</Body>
    <footer>github</footer>
  </Wrapper>
);

export default Page;
