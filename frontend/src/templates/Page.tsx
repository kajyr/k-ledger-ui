import React, { FC } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  header {
    margin-bottom: 15px;

    h1 {
      margin-bottom: 5px;
    }
  }
`;

const Body = styled.main`
  flex: 1;
`;

const Page: FC<{ filename: string }> = ({ filename, children }) => (
  <Wrapper>
    <header>
      <h1>kLedger UI</h1>
      <div>File in use: {filename}</div>
    </header>
    <Body>{children}</Body>
    <footer>github</footer>
  </Wrapper>
);

export default Page;
