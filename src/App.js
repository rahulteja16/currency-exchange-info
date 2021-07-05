import GlobalStyles from './GlobalStyles';
import React from 'react';
import Container from './Container';
import { StoreProvider } from './store';

const App = () => (
  <StoreProvider>
    <GlobalStyles />
    <Container />
  </StoreProvider>
);

export default App;
