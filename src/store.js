import { initialState, reducers } from './reducers';

import React from 'react';

export const Store = React.createContext();

export function StoreProvider({ children, initState = initialState }) {
  const [state, dispatch] = React.useReducer(
    reducers,
    initState,
    (state) => state,
    'currencyConverter'
  );
  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
}
