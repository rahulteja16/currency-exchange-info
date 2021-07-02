import { ConvertTypes } from '../types';

export const convertInitialState = {
  id: '',
  fromCountries: [],
  toCountries: [],
  selectedFromCurrency: '',
  selectedFromAmount: 0,
  selectedToCurrency: '',
  selectedToAmount: 0,
  showAdd: true,
};

export const convertReducer = (state, action) => {
  switch (action.type) {
    case ConvertTypes.INITIAL_DATA: {
      const { selectedCountries, exchangeObj } = action.payload;
      const toCountries = selectedCountries.filter((item) => item.key !== exchangeObj.fromCurrency);
      const fromCountries = selectedCountries.filter((item) => item.key !== exchangeObj.toCurrency);
      const newState = {
        ...{},
        ...convertInitialState,
        ...state.convert,
        fromCountries: [...fromCountries],
        toCountries: [...toCountries],
        selectedFromCurrency: exchangeObj.fromCurrency,
        selectedToCurrency: exchangeObj.toCurrency,
        selectedFromAmount: exchangeObj.fromAmount,
        selectedToAmount: exchangeObj.toAmount,
        showAdd: true,
        id: exchangeObj.id,
      };
      return { ...state, convert: newState };
    }
    case ConvertTypes.UPDATE_FROM_COUNTRIES: {
      const { toCountries: updatedToCountries, selectedFromCurrency: updatedFromCurrencyVal } =
        action.payload;
      const newState = {
        ...{},
        ...convertInitialState,
        ...state.convert,
        ...action.payload,
      };
      newState.toCountries = updatedToCountries;
      newState.selectedFromCurrency = updatedFromCurrencyVal;
      return { ...state, convert: newState };
    }

    case ConvertTypes.UPDATE_TO_COUNTRIES: {
      const { fromCountries: updatedFromCountries, selectedToCurrency: updatedToCurrencyVal } =
        action.payload;
      const newState = {
        ...{},
        ...convertInitialState,
        ...state.convert,
        ...action.payload,
      };
      newState.fromCountries = updatedFromCountries;
      newState.selectedToCurrency = updatedToCurrencyVal;
      return { ...state, convert: newState };
    }
    case ConvertTypes.SWITCH: {
      const newState = {
        ...{},
        ...convertInitialState,
        ...state.convert,
        ...action.payload,
      };
      return { ...state, convert: newState };
    }
    case ConvertTypes.TOGGLE_ADD: {
      const newState = {
        ...{},
        ...convertInitialState,
        ...state.convert,
      };
      if (newState.id === action.payload.id) {
        newState.showAdd = action.payload.status;
      }
      console.log(newState);
      return { ...state, convert: newState };
    }
    default:
      return state;
  }
};
