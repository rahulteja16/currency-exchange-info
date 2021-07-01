import React, { useState } from 'react';
import styled from 'styled-components';
import CurrencyConverter from './CurrencyCoverter';
import PropTypes from 'prop-types';
import Header from './Header';
import { Loader } from '../shared/Loader';

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

const LoaderWrapper = styled.div`
  position: relative;
  height: 100vh;
`;

const ExchangeList = ({
  date,
  countries,
  status,
  exchange,
  onExchangeClick,
  onAddExchange,
  onDeleteExchange,
  onUpdateDate,
}) => {
  const [selectedDate, setSelectedDate] = useState(date);
  const updatedCountries = [];
  countries.forEach((country) => {
    let obj = {
      key: country.code,
      value: country.name,
      id: country.id,
    };
    updatedCountries.push(obj);
  });

  const updateDate = (e) => {
    setSelectedDate(e.target.value);
    onUpdateDate(e.target.value);
  };

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
          <DatePicker type="date" value={selectedDate} onChange={updateDate} max={date} />
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

      {status === 'updating' && (
        <Section>
          <H2Title>Currency Converter</H2Title>
          <LoaderWrapper>
            <Loader />
          </LoaderWrapper>
        </Section>
      )}
    </MainWrapper>
  );
};

ExchangeList.propTypes = {
  date: PropTypes.string,
};

export default ExchangeList;
