import React, { FC } from 'react';
import styled from 'styled-components';

import { Badge, Button, Divider, Group, Title } from '@mantine/core';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  header {
    margin-bottom: 15px;
  }
  footer {
    margin-top: 15px;
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
    <footer>
      <Group position="left">
        <Badge>v{__VERSION__}</Badge>
        <Divider orientation="vertical" mx="sm" />
        <Button
          component="a"
          href="https://github.com/kajyr/k-ledger-ui"
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
          leftIcon={<GitHubLogoIcon />}
          styles={{
            leftIcon: {
              marginRight: 15,
            },
          }}
        >
          Source Code
        </Button>
      </Group>
    </footer>
  </Wrapper>
);

export default Page;
