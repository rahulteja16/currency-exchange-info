import React, { useContext } from 'react';
import styled from 'styled-components';

import {
  API_KEY,
  ARIA,
  BASE_CUR,
  ERROR_MESSAGE,
  MAIN_HEADING,
  RATES_URL,
  STATUS,
} from '../constants';
import { CurrencyTypes } from '../types';

import { Store } from '../store';

import CurrencyConverter from './CurrencyCoverter';
import Header from './Header';
import { Loader } from './Loader';

const DatePicker = styled.input`
  height: 30px;
  margin-top: 10px;
  width: 200px;
  border: none;
  border-bottom: 1px solid #727e89;
  color: #727e89;
  font-size: 15px;
  &:focus {
    outline: thin dotted;
    color: #727e89;
  }
`;

const H2Title = styled.h2`
  color: #3a4450;
  letter-spacing: 0.2px;
`;

const MainWrapper = styled.main`
  display: flex;
  flex: 4;
  flex-flow: column;
`;

const Section = styled.section`
  padding: 2%;
`;

const CenterWrapper = styled.div`
  position: relative;
  height: 80vh;
`;

const Error = styled.div`
  position: absolute;
  top: 50%;
  left: 43%;
  color: #e95050;
  font-size: 20px;
`;

const ExchangeList = () => {
  const {
    state: {
      currencyExchange: { date, exchange, status, countries },
    },
    dispatch,
  } = useContext(Store);

  const onUpdateDate = async (e) => {
    const date = e.target.value;
    dispatch({
      type: CurrencyTypes.UPDATE_DATE,
    });
    const symbols = [];
    countries.map((country) => symbols.push(country.code));

    const conversionRes = await fetch(
      `${RATES_URL}date=${date}&base_currency=${BASE_CUR}&quote_currencies=${symbols.join()}`,
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
      type: CurrencyTypes.UPDATE_EXCHANGE_DATE,
      payload: {
        rates,
        date: conversionData[0].date,
      },
    });
  };

  return (
    <MainWrapper>
      <Header />
      {status === STATUS.LOADING && (
        <CenterWrapper>
          <Loader data-testid="loading" />
        </CenterWrapper>
      )}

      {status === STATUS.ERROR && (
        <CenterWrapper>
          <Error data-testid="error">{ERROR_MESSAGE}</Error>
        </CenterWrapper>
      )}

      {status === STATUS.IDLE && (
        <Section>
          <H2Title>{MAIN_HEADING}</H2Title>
          <DatePicker
            type="date"
            value={date}
            onChange={onUpdateDate}
            max={date}
            aria-label={ARIA.date}
            data-testid="date"
          />
          {exchange.map((item) => {
            return <CurrencyConverter key={item.id} exchangeObj={item} idx={item.id} />;
          })}
        </Section>
      )}

      {status === STATUS.UPDATING && (
        <Section>
          <H2Title>{MAIN_HEADING}</H2Title>
          <CenterWrapper>
            <Loader data-testid="updating" />
          </CenterWrapper>
        </Section>
      )}
    </MainWrapper>
  );
};

export default ExchangeList;
