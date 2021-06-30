import React, { useEffect } from 'react';
import styled from 'styled-components';
import { CurrencyTypes } from './types';
import CurrencyList from './components/CurrencyList';
import { API_KEY, COUNTRIES_URL, RATES_URL } from './constants';
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
            fromCurrency: 'EUR',
            fromAmount: 0,
            toCurrency: 'USD',
            toAmount: 0,
          },
        ],
        status: 'idel',
      };
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
      const { data } = await axios.get(COUNTRIES_URL, {
        headers: {
          Authorization: `ApiKey ${API_KEY}`,
        },
      });
      const countries = [];
      for (const currency of data) {
        let obj = {
          id: currency.numeric_code,
          code: currency.code,
          name: `${currency.name} - ${currency.code}`,
          selected:
            currency.code === 'USD' || currency.code === 'EUR' || currency.code === 'INR'
              ? true
              : false,
        };
        countries.push(obj);
      }
      const { data: convRes } = await axios.get(
        `${RATES_URL}base_currency=EUR&quote_currencies=USD,INR`,
        {
          headers: {
            Authorization: `ApiKey ${API_KEY}`,
          },
        }
      );
      const rates = {};
      for (let conv in convRes) {
        rates[convRes[conv].quote_currency] = convRes[conv].quote;
      }
      rates[convRes[0].base_currency] = 1;
      dispatch({
        type: CurrencyTypes.FETCH_INITAL_DATA,
        payload: {
          countries,
          rates,
          date: new Date(convRes[0].date).toUTCString(),
        },
      });
    };
  }

  const onExchange = (index, exchangeObj) => {
    console.log(index);
    console.log(exchangeObj);
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
      />
      <AsideWrapper>
        <CurrencyList countries={state.countries} status={state.status} />
      </AsideWrapper>
    </SectionWrapper>
  );
};

export default Skelton;
