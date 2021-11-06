import React, { FC } from 'react';
import { useQuery } from 'react-query';

import Loader from 'atoms/Loader';

import Page from 'templates/Page';

import Dashboard from 'pages/dashboard';

import { Api } from 'types';

const App: FC = () => {
  const { isLoading, error, data } = useQuery<Api.BootstrapResponse>(
    "bootstrap",
    () => fetch("/api/bootstrap").then((res) => res.json())
  );

  if (isLoading || !data) {
    return <Loader />;
  }

  return (
    <>
      <Page filename={data.file}>
        <Dashboard journal={data} />
      </Page>
    </>
  );
};

export default App;
