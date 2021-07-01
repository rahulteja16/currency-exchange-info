import React, { useEffect, useReducer } from 'react';
import styled from 'styled-components';
import { CurrencyTypes } from './types';
import { API_KEY, COUNTRIES_URL, RATES_URL } from './constants';
import ExchangeList from './components/ExchangeList';

const SectionWrapper = styled.div`
  display: flex;
`;

const initialState = {
  date: '',
  countries: [],
  rates: {},
  exchange: [],
  status: 'loading',
};

const reducer = (state, action) => {
  switch (action.type) {
    case CurrencyTypes.FETCH_INITAL_DATA:
      const { countries, rates, date } = action.payload;
      return {
        date,
        countries,
        rates,
        exchange: [
          {
            id: 'EUR-USD-0',
            fromCurrency: 'EUR',
            fromAmount: 0,
            toCurrency: 'USD',
            toAmount: 0,
          },
        ],
        status: 'idle',
      };
    case CurrencyTypes.ADD_EXCHANGE:
      const newExchange = { ...state };
      newExchange.exchange = action.payload.exchange;
      return newExchange;
    case CurrencyTypes.DELETE_EXCHANGE:
      const deleteExchange = { ...state };
      deleteExchange.exchange = action.payload.exchange;
      console.log(deleteExchange);
      return deleteExchange;
    case CurrencyTypes.UPDATE_EXCHANGE:
      const updatedState = { ...state };
      const { idx, exchangeObj } = action.payload;
      updatedState.exchange.forEach((item) => {
        if (item.id === idx) {
          item.fromAmount = exchangeObj.fromAmount;
          item.toAmount = exchangeObj.toAmount;
        }
      });
      return updatedState;
    case CurrencyTypes.LOADING:
      return { ...state, status: 'loading' };
    default:
      return state;
  }
};

const Skelton = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const onExchange = (index, exchangeObj) => {
    const currencyBase = state.rates[exchangeObj.fromCurrency];
    const inEuros = parseFloat(exchangeObj.fromAmount) / currencyBase;
    const finalObj = { ...exchangeObj };
    finalObj['toAmount'] = inEuros * state.rates[exchangeObj.toCurrency];
    dispatch({
      type: CurrencyTypes.UPDATE_EXCHANGE,
      payload: {
        exchangeObj: finalObj,
        idx: index,
      },
    });
  };

  const onAddExchange = () => {
    const currentExchange = [...state.exchange];
    currentExchange.push({
      id: `EUR-USD-${currentExchange.length}`,
      fromCurrency: 'EUR',
      fromAmount: 0,
      toCurrency: 'USD',
      toAmount: 0,
    });
    dispatch({
      type: CurrencyTypes.ADD_EXCHANGE,
      payload: {
        exchange: currentExchange,
      },
    });
  };

  const onDeleteExchange = (idx) => {
    const currentExchange = [...state.exchange];
    currentExchange.splice(idx, 1);
    dispatch({
      type: CurrencyTypes.DELETE_EXCHANGE,
      payload: {
        exchange: currentExchange,
      },
    });
  };

  useEffect(() => {
    const asyncDispatch = async () => {
      dispatch({
        type: CurrencyTypes.LOADING,
      });

      const countriesRes = await fetch(COUNTRIES_URL, {
        headers: {
          Authorization: `ApiKey ${API_KEY}`,
        },
      });
      const countryData = await countriesRes.json();
      const activeCountryData = countryData.filter((item) => item.active);
      const countries = [];
      const symbols = [];
      for (const currency of activeCountryData) {
        symbols.push(currency.code);
        const obj = {
          code: currency.code,
          id: currency.numeric_code,
          name: `${currency.name} - ${currency.code}`,
        };
        countries.push(obj);
      }
      const conversionRes = await fetch(
        `${RATES_URL}&base_currency=EUR&quote_currencies=${symbols.join()}`,
        {
          headers: {
            Authorization: `ApiKey ${API_KEY}`,
          },
        }
      );
      const conversionData = await conversionRes.json();
      const rates = {};
      for (let conv in conversionData) {
        rates[conversionData[conv].quote_currency] = conversionData[conv].quote;
      }
      rates[conversionData[0].base_currency] = 1;
      dispatch({
        type: CurrencyTypes.FETCH_INITAL_DATA,
        payload: {
          countries,
          rates,
          date: new Date(conversionData.date).toUTCString(),
        },
      });
    };
    if (state.countries.length === 0) {
      asyncDispatch();
    }
  }, [state.countries.length, dispatch]);

  return (
    <SectionWrapper>
      <ExchangeList
        date={state.date}
        countries={state.countries}
        status={state.status}
        exchange={state.exchange}
        onExchangeClick={onExchange}
        onAddExchange={onAddExchange}
        onDeleteExchange={onDeleteExchange}
      />
    </SectionWrapper>
  );
};

export default Skelton;
