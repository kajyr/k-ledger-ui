import { Api } from 'types';

import React, { FC } from 'react';
import { useQuery } from 'react-query';

import Loader from 'atoms/Loader';

import Page from 'templates/Page';

import Dashboard from 'pages/dashboard';
import Review from 'pages/review';

import { Paper, Tabs } from '@mantine/core';

const App: FC = () => {
  const { isLoading, data } = useQuery<Api.BootstrapResponse>('bootstrap', () =>
    fetch('/api/bootstrap').then(res => res.json())
  );

  if (isLoading || !data) {
    return <Loader />;
  }

  return (
    <>
      <Page filename={data.file}>
        <Paper p="md" shadow="sm" component="section">
          <Tabs>
            <Tabs.Tab label="Add">
              <Dashboard journal={data} />
            </Tabs.Tab>
            <Tabs.Tab label="Review">
              <Review journal={data} />
            </Tabs.Tab>
          </Tabs>
        </Paper>
      </Page>
    </>
  );
};

export default App;
