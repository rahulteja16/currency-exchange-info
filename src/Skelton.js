import React, { useEffect } from 'react';
import styled from 'styled-components';
import { CurrencyTypes } from './types';
import CurrencyList from './components/CurrencyList';
import { COUNTRIES_URL, RATES_URL } from './constants';
import axios from 'axios';
import ExchangeList from './components/ExchangeList';
import useReducerWithThunk from './hooks/useReducerWithThunk';

const SectionWrapper = styled.div`
  display: flex;
`;

const AsideWrapper = styled.aside`
  display: flex;
  flex: 1;
  flex-flow: column;
  background-color: #384553;
  overflow-y: auto;
  height: 100vh;
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
        status: 'idel',
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
  const [state, dispatch] = useReducerWithThunk(reducer, initialState);

  function fetchData() {
    return async (dispatch) => {
      dispatch({
        type: CurrencyTypes.LOADING,
      });
      const { data } = await axios.get(COUNTRIES_URL);
      const countries = [];
      for (const currency in data.symbols) {
        let obj = {
          currency,
          value: `${data.symbols[currency]} - ${currency}`,
          selected:
            currency === 'USD' ||
            currency === 'EUR' ||
            currency === 'INR' ||
            currency === 'GBP' ||
            currency === 'AUD'
              ? true
              : false,
        };
        countries.push(obj);
      }
      const { data: conRes } = await axios.get(`${RATES_URL}&base=EUR&symbols=USD,INR,GBP,AUD`);
      const rates = { ...conRes.rates };
      rates[conRes.base] = 1;
      dispatch({
        type: CurrencyTypes.FETCH_INITAL_DATA,
        payload: {
          countries,
          rates,
          date: new Date(conRes.date).toUTCString(),
        },
      });
    };
  }

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
    dispatch(fetchData());
  }, []);

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
      <AsideWrapper>
        <CurrencyList countries={state.countries} status={state.status} />
      </AsideWrapper>
    </SectionWrapper>
  );
};

export default Skelton;
