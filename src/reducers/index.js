import { currencyExchangeInitialState, currencyExchangeReducer } from './currencyExchange';

const reduceReducers =
  (...reducers) =>
  (prevState, value, ...args) =>
    reducers.reduce((newState, reducer) => reducer(newState, value, ...args), prevState);

export const reducers = reduceReducers(currencyExchangeReducer);

export const initialState = {
  currencyExchange: currencyExchangeInitialState,
};
