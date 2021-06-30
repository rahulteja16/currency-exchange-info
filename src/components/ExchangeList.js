import React from 'react';
import styled from 'styled-components';
import CurrencyConverter from './CurrencyCoverter';
import PropTypes from 'prop-types';
import Header from './Header';
import { Loader } from '../shared/Loader';

const H3Date = styled.h3`
  font-size: 12px;
  margin-top: 2px;
  color: #90959a;
  letter-spacing: 0.3px;
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

const LoaderWrapper = styled.div`
  position: relative;
  height: 100%;
`;

const ExchangeList = ({ date, countries, status, exchange, onExchangeClick }) => {
  const selectedCountries = countries.filter((country) => country.selected);
  const updatedCountries = [];
  selectedCountries.forEach((country) => {
    let obj = {
      key: country.currency,
      value: country.value,
    };
    updatedCountries.push(obj);
  });

  return (
    <MainWrapper>
      <Header />
      {status === 'loading' && (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      )}

      {status === 'idel' && (
        <Section>
          <H2Title>Currency Converter</H2Title>
          <H3Date>{date}</H3Date>
          {exchange.map((item, index) => {
            return (
              <CurrencyConverter
                selectedCountries={updatedCountries}
                exchangeObj={item}
                index
                onExchangeClick
              />
            );
          })}
        </Section>
      )}
    </MainWrapper>
  );
};

ExchangeList.propTypes = {
  date: PropTypes.string,
};

export default ExchangeList;
