import { BASE_CUR, BASE_TO_CUR, STATUS } from '../constants';
import { CurrencyTypes } from '../types';

export const currencyExchangeInitialState = {
  date: '',
  countries: [],
  rates: {},
  exchange: [],
  status: STATUS.LOADING,
};

export const currencyExchangeReducer = (state, action) => {
  switch (action.type) {
    case CurrencyTypes.FETCH_INITAL_DATA: {
      const newState = {
        ...{},
        ...currencyExchangeInitialState,
        ...state.currencyExchange,
        ...action.payload,
      };
      return { ...state, currencyExchange: newState };
    }
    case CurrencyTypes.ADD_EXCHANGE: {
      const newState = {
        ...{},
        ...currencyExchangeInitialState,
        ...state.currencyExchange,
        ...action.payload,
      };
      return { ...state, currencyExchange: newState };
    }
    case CurrencyTypes.DELETE_EXCHANGE: {
      const newState = {
        ...{},
        ...currencyExchangeInitialState,
        ...state.currencyExchange,
        exchange: action.payload.exchange,
      };
      return { ...state, currencyExchange: newState };
    }
    case CurrencyTypes.UPDATE_EXCHANGE: {
      const newState = {
        ...{},
        ...currencyExchangeInitialState,
        ...state.currencyExchange,
      };
      const { exchangeObj } = action.payload;
      const updatedExchange = newState.exchange.map((item) => {
        if (item.id === exchangeObj.id) {
          item = { ...exchangeObj };
        }
        return item;
      });
      newState.exchange = [...updatedExchange];
      return { ...state, currencyExchange: newState };
    }
    case CurrencyTypes.LOADING: {
      const newState = {
        ...{},
        ...currencyExchangeInitialState,
        ...state.currencyExchange,
        ...action.payload,
      };
      newState.status = STATUS.LOADING;
      return { ...state, currencyExchange: newState };
    }
    case CurrencyTypes.ERROR: {
      const newState = {
        ...{},
        ...currencyExchangeInitialState,
        ...state.currencyExchange,
        ...action.payload,
      };
      newState.status = STATUS.ERROR;
      return { ...state, currencyExchange: newState };
    }
    case CurrencyTypes.UPDATE_DATE: {
      const newState = {
        ...{},
        ...currencyExchangeInitialState,
        ...state.currencyExchange,
        ...action.payload,
      };
      newState.status = STATUS.UPDATING;
      return { ...state, currencyExchange: newState };
    }
    case CurrencyTypes.UPDATE_EXCHANGE_DATE: {
      const newState = {
        ...{},
        ...currencyExchangeInitialState,
        ...state.currencyExchange,
        ...action.payload,
      };
      newState.status = STATUS.IDLE;
      newState.rates = action.payload.rates;
      newState.date = action.payload.date;
      newState.exchange = [
        {
          id: `${BASE_CUR}-${BASE_TO_CUR}-0`,
          selectedFromCurrency: BASE_CUR,
          selectedFromAmount: 1,
          selectedToCurrency: BASE_TO_CUR,
          selectedToAmount: parseFloat(newState.rates[BASE_TO_CUR]).toFixed(2),
          showAdd: true,
        },
      ];
      return { ...state, currencyExchange: newState };
    }
    default:
      return state;
  }
};
