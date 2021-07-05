import { API_KEY, BASE_CUR, BASE_TO_CUR, COUNTRIES_URL, RATES_URL, STATUS } from './constants';
import React, { useContext, useEffect } from 'react';

import { CurrencyTypes } from './types';
import ExchangeList from './components/ExchangeList';
import { Store } from './store';
import styled from 'styled-components';

const SectionWrapper = styled.div`
  display: flex;
`;

const Skelton = () => {
  const {
    state: { currencyExchange },
    dispatch,
  } = useContext(Store);

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
      if (countryData.error) {
        dispatch({
          type: CurrencyTypes.ERROR,
        });
      } else {
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
          `${RATES_URL}&base_currency=${BASE_CUR}&quote_currencies=${symbols.join()}`,
          {
            headers: {
              Authorization: `ApiKey ${API_KEY}`,
            },
          }
        );
        const conversionData = await conversionRes.json();
        if (conversionData.error) {
          dispatch({
            type: CurrencyTypes.ERROR,
          });
        } else {
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
              date: conversionData[0].date,
              exchange: [
                {
                  id: `${BASE_CUR}-${BASE_TO_CUR}-0`,
                  selectedFromCurrency: BASE_CUR,
                  selectedFromAmount: 1,
                  selectedToCurrency: BASE_TO_CUR,
                  selectedToAmount: parseFloat(rates[BASE_TO_CUR]).toFixed(2),
                  showAdd: true,
                },
              ],
              status: STATUS.IDLE,
            },
          });
        }
      }
    };

    if (currencyExchange.countries.length === 0) {
      asyncDispatch();
    }
  }, [currencyExchange.countries, dispatch]);

  return (
    <SectionWrapper>
      <ExchangeList />
    </SectionWrapper>
  );
};

export default Skelton;
