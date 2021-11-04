import React, { FC } from 'react';
import { useQuery } from 'react-query';

import Loader from 'atoms/Loader';

import Page from 'templates/Page';

import Dashboard from 'pages/dashboard';

const App: FC = () => {
  const { isLoading, error, data } = useQuery("bootstrap", () =>
    fetch("/api/bootstrap").then((res) => res.json())
  );

  console.log(isLoading, data);
  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Page filename={data.file}>
        <Dashboard />
      </Page>
    </>
  );
};

export default App;
