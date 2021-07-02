import GlobalStyles from './GlobalStyles';
import React from 'react';
import Skelton from './Skelton';
import { StoreProvider } from './store';

const App = () => (
  <StoreProvider>
    <GlobalStyles />
    <Skelton />
  </StoreProvider>
);

export default App;
