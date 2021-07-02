import {
  API_KEY,
  ARIA,
  BASE_CUR,
  BASE_TO_CUR,
  ERROR_MESSAGE,
  MAIN_HEADING,
  RATES_URL,
  STATUS,
} from '../constants';
import React, { useContext } from 'react';

import CurrencyConverter from './CurrencyCoverter';
import { CurrencyTypes } from '../types';
import Header from './Header';
import { Loader } from './Loader';
import PropTypes from 'prop-types';
import { Store } from '../store';
import styled from 'styled-components';

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
      currencyExchange: { date, rates, exchange, status, countries },
    },
    dispatch,
  } = useContext(Store);

  const onExchange = (index, exchangeObj) => {
    const currencyBase = rates[exchangeObj.fromCurrency];
    const inEuros = parseFloat(exchangeObj.fromAmount) / currencyBase;
    const finalObj = { ...exchangeObj };
    finalObj['toAmount'] = inEuros * rates[exchangeObj.toCurrency];

    dispatch({
      type: CurrencyTypes.UPDATE_EXCHANGE,
      payload: {
        exchangeObj: finalObj,
        idx: index,
      },
    });
  };

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

  const onAddExchange = () => {
    const currentExchange = [...exchange];
    currentExchange.push({
      id: `${BASE_CUR}-${BASE_TO_CUR}-${currentExchange.length}`,
      fromCurrency: BASE_CUR,
      fromAmount: 0,
      toCurrency: BASE_TO_CUR,
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
    const currentExchange = [...exchange];
    currentExchange.splice(idx, 1);
    dispatch({
      type: CurrencyTypes.DELETE_EXCHANGE,
      payload: {
        exchange: currentExchange,
      },
    });
  };

  const updatedCountries = [];
  countries.forEach((country) => {
    let obj = {
      key: country.code,
      value: country.name,
      id: country.id,
    };
    updatedCountries.push(obj);
  });

  return (
    <MainWrapper>
      <Header />
      {status === STATUS.LOADING && (
        <CenterWrapper>
          <Loader />
        </CenterWrapper>
      )}

      {status === STATUS.ERROR && (
        <CenterWrapper>
          <Error>{ERROR_MESSAGE}</Error>
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
          />
          {exchange.map((item) => {
            return (
              <CurrencyConverter
                key={item.id}
                selectedCountries={updatedCountries}
                exchangeObj={item}
                idx={item.id}
                onExchangeClick={onExchange}
                onAddExchange={onAddExchange}
                onDeleteExchange={onDeleteExchange}
              />
            );
          })}
        </Section>
      )}

      {status === STATUS.UPDATING && (
        <Section>
          <H2Title>{MAIN_HEADING}</H2Title>
          <CenterWrapper>
            <Loader />
          </CenterWrapper>
        </Section>
      )}
    </MainWrapper>
  );
};

ExchangeList.propTypes = {
  date: PropTypes.string,
  status: PropTypes.string,
  countries: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  exchange: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      fromCurrency: PropTypes.string.isRequired,
      fromAmount: PropTypes.number.isRequired,
      toCurrency: PropTypes.string.isRequired,
      toAmount: PropTypes.number.isRequired,
    })
  ),
  rates: PropTypes.objectOf(PropTypes.number),
};

export default ExchangeList;
