import React, { FC } from 'react';
import { useQuery } from 'react-query';

import { Api } from 'types';

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
          <Tabs defaultValue="dashboard">
            <Tabs.List>
              <Tabs.Tab value="dashboard">Add</Tabs.Tab>
              <Tabs.Tab value="review">Review</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="dashboard">
              <Dashboard journal={data} />
            </Tabs.Panel>

            <Tabs.Panel value="review">
              <Review journal={data} />
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </Page>
    </>
  );
};

export default App;
