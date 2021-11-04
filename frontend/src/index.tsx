import React from 'react';
import { render } from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { NotificationsProvider } from '@mantine/notifications';

import App from './App';
import GlobalStyle from './globalstyle';
import FourOhFour from './pages/four-oh-four';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

render(
  <>
    <GlobalStyle />
    <NotificationsProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<FourOhFour />} />
            <Route path="/" element={<App />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </NotificationsProvider>
  </>,
  document.getElementById("rroot")
);
