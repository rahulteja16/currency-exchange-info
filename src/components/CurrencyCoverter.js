import { faRandom } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import styled from 'styled-components';

import CustomDropDown from '../shared/CustomDropdown';

const RowDiv = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${(props) => (props.padding ? props.padding : '0')};
`;

const Exchange = styled.div`
  height: 70px;
  width: 70px;
  position: relative;
  border-radius: 50%;
  border: 1px solid #e7f0f7;
  background-color: #e7f0f7;
`;

const ExchangeButton = styled.div`
  position: absolute;
  border-radius: 50%;
  right: 12px;
  left: 12px;
  top: 12px;
  bottom: 12px;
  background-color: #3588e7;
`;

const Icon = styled.div`
  position: absolute;
  top: 14px;
  left: 14px;
  bottom: 14px;
  right: 14px;
  color: #ffffff;
`;
const InputWrapper = styled.div`
  display: flex;
  width: 40%;
  flex-flow: column;
`;

const NumberInput = styled.input`
  width: 100%;
  border: none;
  font-size: 24px;
  font-weight: normal;
  font-family: 'Roboto';
  color: #727e89;
  border-bottom: 1px solid #727e89;
  &:focus {
    outline: thin dotted;
    color: #727e89;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  border-bottom: 1px solid #e2e6e8;
  padding: 20px 5px;
`;

const AddButton = styled.input`
  height: 30px;
  width: 70px;
  border-radius: 20px;
  border: none;
  color: #ffffff;
  background-color: #3588e7;
`;

const CurrencyConverter = ({ selectedCountries, exchangeObj, index, onExchangeClick }) => {
  const [fromCountriesArr, setFromCountries] = useState([...selectedCountries]);
  const [toCountriesArr, setToCountries] = useState([...selectedCountries]);
  const [selectedFromCurrency, setSelectedFromCurrency] = useState(exchangeObj.fromCurrency);
  const [selectedToCurrency, setSelectedToCurrency] = useState(exchangeObj.toCurrency);

  const updateFromCountries = (e) => {
    setSelectedFromCurrency(e.target.value);
    setToCountries(selectedCountries.filter((item) => item.key !== e.target.value));
  };

  const updateToCountries = (e) => {
    setSelectedToCurrency(e.target.value);
    setFromCountries(selectedCountries.filter((item) => item.key !== e.target.value));
  };

  const onSwitch = () => {
    const from = selectedFromCurrency;
    const to = selectedToCurrency;
    setSelectedFromCurrency(to);
    setSelectedToCurrency(from);
    setToCountries(fromCountriesArr);
    setFromCountries(toCountriesArr);
  };

  const validateAmount = (e) => {
    let obj = {
      fromCurrency: selectedFromCurrency,
      fromAmount: e.target.value,
      toCurrency: selectedToCurrency,
    };
    onExchangeClick(index, obj);
  };

  return (
    <section>
      <RowDiv padding="3% 0 0 0">
        <CustomDropDown
          keyVal="ConvertFrom"
          label="From"
          items={fromCountriesArr}
          onSelect={updateFromCountries}
          selectedValue={selectedFromCurrency}
        />
        <Exchange role="button" onClick={onSwitch}>
          <ExchangeButton aria-label="Exchange">
            <Icon>
              <FontAwesomeIcon icon={faRandom} />
            </Icon>
          </ExchangeButton>
        </Exchange>
        <CustomDropDown
          keyVal="ConvertTo"
          label="To"
          items={toCountriesArr}
          onSelect={updateToCountries}
          selectedValue={selectedToCurrency}
        />
      </RowDiv>
      <RowDiv>
        <InputWrapper>
          <NumberInput
            type="number"
            placeholder="Enter Amount"
            aria-label="Enter Source Amount"
            onBlur={validateAmount}
          />
        </InputWrapper>
        <InputWrapper>
          <NumberInput type="number" placeholder="Amount" aria-label="Target Amount" disabled />
        </InputWrapper>
      </RowDiv>
      <ButtonWrapper>
        <AddButton type="button" value="Add" />
      </ButtonWrapper>
    </section>
  );
};

export default CurrencyConverter;
