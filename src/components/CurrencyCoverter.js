import React, { useContext } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRandom } from '@fortawesome/free-solid-svg-icons';

import { Store } from '../store';

import { CurrencyTypes } from '../types';
import { ARIA, BASE_CUR, BASE_TO_CUR, CONVERTER } from '../constants';

import CustomDropDown from './CustomDropdown';

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

const Button = styled.button`
  background-color: transparent;
  border: none;
  height: 25px;
  margin-left: 10px;
  margin-top: 9px;
  width: 25px;
`;

const AddButton = styled.input`
  height: 30px;
  width: 70px;
  border-radius: 20px;
  border: none;
  color: #ffffff;
  background-color: #3588e7;
`;

const DeleteButton = styled.input`
  height: 30px;
  width: 70px;
  border-radius: 20px;
  border: none;
  color: #ffffff;
  background-color: #dc6565;
`;

const calculateConversion = (exchange, dispatch, rates) => {
  const obj = { ...exchange };
  const currencyBase = rates[obj.selectedFromCurrency];
  const inEuros = parseFloat(obj.selectedFromAmount) / currencyBase;

  if (
    obj.selectedFromAmount < Number.MAX_SAFE_INTEGER &&
    obj.selectedToAmount < Number.MAX_SAFE_INTEGER
  ) {
    obj['selectedToAmount'] = parseFloat(inEuros * rates[obj.selectedToCurrency]).toFixed(2);
    dispatch({
      type: CurrencyTypes.UPDATE_EXCHANGE,
      payload: {
        exchangeObj: obj,
      },
    });
  }
};

const CurrencyConverter = ({ idx }) => {
  const {
    state: {
      currencyExchange: { rates, countries, exchange: exchangeArr },
    },
    dispatch,
  } = useContext(Store);

  const exchangeFilter = exchangeArr.filter((item) => item.id === idx);
  const exchangeObj = exchangeFilter[0];

  const fromCountries = countries.filter((item) => item.code !== exchangeObj.selectedToCurrency);
  const toCountries = countries.filter((item) => item.code !== exchangeObj.selectedFromCurrency);

  const updateFromCountries = (e) => {
    const obj = { ...exchangeObj };
    obj.selectedFromCurrency = e.target.value;
    calculateConversion(obj, dispatch, rates);
  };

  const updateToCountries = (e) => {
    const obj = { ...exchangeObj };
    obj.selectedToCurrency = e.target.value;
    calculateConversion(obj, dispatch, rates);
  };

  const validateAmount = (e) => {
    const val = e.target.value
      .toString()
      .split('.')
      .map((el, i) => (i ? el.split('').slice(0, 2).join('') : el))
      .join('.');
    const obj = { ...exchangeObj };
    obj.selectedFromAmount = parseFloat(val);
    calculateConversion(obj, dispatch, rates);
  };

  const onSwitch = () => {
    const {
      selectedFromCurrency,
      selectedToCurrency,
      selectedFromAmount,
      selectedToAmount,
      id,
      showAdd,
    } = exchangeObj;

    dispatch({
      type: CurrencyTypes.UPDATE_EXCHANGE,
      payload: {
        exchangeObj: {
          id,
          selectedFromCurrency: selectedToCurrency,
          selectedFromAmount: selectedToAmount,
          selectedToCurrency: selectedFromCurrency,
          selectedToAmount: selectedFromAmount,
          showAdd,
        },
      },
    });
  };

  const addConverter = () => {
    const updatedExchangeArr = [...exchangeArr];
    updatedExchangeArr.forEach((item) => {
      item.showAdd = false;
    });
    let obj = {
      id: `${BASE_CUR}-${BASE_TO_CUR}-${updatedExchangeArr.length}`,
      selectedFromCurrency: BASE_CUR,
      selectedFromAmount: 1,
      selectedToCurrency: BASE_TO_CUR,
      selectedToAmount: parseFloat(rates[BASE_TO_CUR]).toFixed(2),
      showAdd: true,
    };
    updatedExchangeArr.push(obj);
    dispatch({
      type: CurrencyTypes.ADD_EXCHANGE,
      payload: {
        exchange: updatedExchangeArr,
      },
    });
  };

  const deleteConvert = () => {
    const currentExchange = [...exchangeArr];
    currentExchange.splice(idx, 1);
    dispatch({
      type: CurrencyTypes.DELETE_EXCHANGE,
      payload: {
        exchange: currentExchange,
      },
    });
  };

  return (
    <section data-testid={`currency-converter-${idx}`}>
      <RowDiv padding="3% 0 0 0">
        <CustomDropDown
          keyVal={CONVERTER.fromKey}
          aria-label={ARIA.fromCurrency}
          label={CONVERTER.fromLabel}
          items={fromCountries}
          onSelect={updateFromCountries}
          selectedValue={exchangeObj.selectedFromCurrency}
        />
        <Exchange role="button" onClick={onSwitch} data-testid="switch">
          <ExchangeButton aria-label={ARIA.exchange}>
            <Button aria-label={ARIA.exchange}>
              <Icon>
                <FontAwesomeIcon icon={faRandom} />
              </Icon>
            </Button>
          </ExchangeButton>
        </Exchange>
        <CustomDropDown
          keyVal={CONVERTER.toKey}
          label={CONVERTER.toLabel}
          aria-label={ARIA.toCurrency}
          items={toCountries}
          onSelect={updateToCountries}
          selectedValue={exchangeObj.selectedToCurrency}
        />
      </RowDiv>
      <RowDiv>
        <InputWrapper>
          <NumberInput
            data-testid="sourceAmount"
            type="number"
            aria-label={ARIA.sourceAmount}
            onChange={validateAmount}
            min={0}
            value={exchangeObj.selectedFromAmount}
            step="0.01"
          />
        </InputWrapper>
        <InputWrapper>
          <NumberInput
            data-testid="targetAmount"
            type="number"
            min={0}
            aria-label={ARIA.targetAmount}
            disabled
            value={exchangeObj.selectedToAmount}
          />
        </InputWrapper>
      </RowDiv>

      <ButtonWrapper>
        {exchangeObj.showAdd && (
          <AddButton type="button" value={CONVERTER.add} onClick={addConverter} />
        )}
        {!exchangeObj.showAdd && (
          <DeleteButton type="button" value={CONVERTER.delete} onClick={deleteConvert} />
        )}
      </ButtonWrapper>
    </section>
  );
};

CurrencyConverter.propTypes = {
  idx: PropTypes.string.isRequired,
};

export default CurrencyConverter;
