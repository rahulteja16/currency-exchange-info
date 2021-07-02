import { convertInitialState, convertReducer } from './convert';
import { currencyExchangeInitialState, currencyExchangeReducer } from './currencyExchange';

const reduceReducers =
  (...reducers) =>
  (prevState, value, ...args) =>
    reducers.reduce((newState, reducer) => reducer(newState, value, ...args), prevState);

export const reducers = reduceReducers(convertReducer, currencyExchangeReducer);

export const initialState = {
  convert: convertInitialState,
  currencyExchange: currencyExchangeInitialState,
};
