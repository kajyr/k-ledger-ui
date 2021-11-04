import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Page from 'templates/Page';

import Dashboard from 'pages/dashboard';

import GlobalStyle from './globalstyle';
import FourOhFour from './pages/four-oh-four';

render(
  <>
    <GlobalStyle />
    <Page>
      <BrowserRouter>
        <Routes>
          <Route path="/404" element={<FourOhFour />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </Page>
  </>,
  document.getElementById("rroot")
);
