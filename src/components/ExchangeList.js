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

const ExchangeList = ({
  date,
  countries,
  status,
  exchange,
  onExchangeClick,
  onAddExchange,
  onDeleteExchange,
}) => {
  const updatedCountries = [];
  countries.forEach((country) => {
    let obj = {
      key: country.code,
      value: country.name,
      id: country.id,
    };
    updatedCountries.push(obj);
  });

  console.log(updatedCountries);

  return (
    <MainWrapper>
      <Header />
      {status === 'loading' && (
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      )}

      {status === 'idle' && (
        <Section>
          <H2Title>Currency Converter</H2Title>
          <H3Date>{date}</H3Date>
          {exchange.map((item) => {
            return (
              <CurrencyConverter
                key={item.id}
                selectedCountries={updatedCountries}
                exchangeObj={item}
                idx={item.id}
                onExchangeClick={onExchangeClick}
                onAddExchange={onAddExchange}
                onDeleteExchange={onDeleteExchange}
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
