import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRandom } from '@fortawesome/free-solid-svg-icons';

import { Store } from '../store';

import { ConvertTypes } from '../types';
import { ARIA, CONVERTER } from '../constants';

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

const CurrencyConverter = ({
  selectedCountries,
  exchangeObj,
  idx,
  onExchangeClick,
  onAddExchange,
  onDeleteExchange,
}) => {
  const {
    state: { convert: convertState },
    dispatch,
  } = useContext(Store);

  console.log(exchangeObj);

  useEffect(() => {
    if (
      convertState.selectedFromAmount !== exchangeObj.fromAmount ||
      convertState.toCountries.length === 0
    ) {
      dispatch({
        type: ConvertTypes.INITIAL_DATA,
        payload: {
          selectedCountries,
          exchangeObj,
        },
      });
    }
  }, [dispatch, exchangeObj, selectedCountries, convertState]);

  const updateFromCountries = (e) => {
    dispatch({
      type: ConvertTypes.UPDATE_FROM_COUNTRIES,
      payload: {
        toCountries: selectedCountries.filter((item) => item.key !== e.target.value),
        selectedFromCurrency: e.target.value,
      },
    });
    let obj = {
      fromCurrency: e.target.value,
      fromAmount:
        convertState.selectedFromAmount !== '' ? parseFloat(convertState.selectedFromAmount) : 0,
      toCurrency: convertState.selectedToCurrency,
    };
    onExchangeClick(idx, obj);
  };

  const updateToCountries = (e) => {
    dispatch({
      type: ConvertTypes.UPDATE_TO_COUNTRIES,
      payload: {
        fromCountries: selectedCountries.filter((item) => item.key !== e.target.value),
        selectedToCurrency: e.target.value,
      },
    });

    let obj = {
      fromCurrency: convertState.selectedFromCurrency,
      fromAmount:
        convertState.selectedFromAmount !== '' ? parseFloat(convertState.selectedFromAmount) : 0,
      toCurrency: e.target.value,
    };
    onExchangeClick(idx, obj);
  };

  const onSwitch = () => {
    const {
      selectedFromCurrency,
      selectedToCurrency,
      selectedFromAmount,
      selectedToAmount,
      toCountries,
      fromCountries,
    } = convertState;

    dispatch({
      type: ConvertTypes.SWITCH,
      payload: {
        fromCountries: toCountries,
        toCountries: fromCountries,
        selectedFromCurrency: selectedToCurrency,
        selectedFromAmount: selectedToAmount,
        selectedToCurrency: selectedFromCurrency,
        selectedToAmount: selectedFromAmount,
        showAdd: true,
      },
    });
  };

  const validateAmount = (e) => {
    let val = e.target.value
      .toString()
      .split('.')
      .map((el, i) => (i ? el.split('').slice(0, 2).join('') : el))
      .join('.');
    let obj = {
      fromCurrency: convertState.selectedFromCurrency,
      fromAmount: val !== '' ? val : 0,
      toCurrency: convertState.selectedToCurrency,
    };
    onExchangeClick(idx, obj);
  };

  const addConverter = () => {
    dispatch({
      type: ConvertTypes.TOGGLE_ADD,
      payload: {
        status: false,
        id: convertState.id,
      },
    });
    onAddExchange();
  };

  const deleteConvert = () => {
    onDeleteExchange(idx);
  };

  return (
    <section>
      <RowDiv padding="3% 0 0 0">
        <CustomDropDown
          keyVal={CONVERTER.fromKey}
          aria-label={ARIA.fromCurrency}
          label={CONVERTER.fromLabel}
          items={convertState.fromCountries}
          onSelect={updateFromCountries}
          selectedValue={convertState.selectedFromCurrency}
        />
        <Exchange role="button" onClick={onSwitch} tabindex="0">
          <ExchangeButton aria-label={ARIA.exchange}>
            <Icon>
              <FontAwesomeIcon icon={faRandom} />
            </Icon>
          </ExchangeButton>
        </Exchange>
        <CustomDropDown
          keyVal={CONVERTER.toKey}
          label={CONVERTER.toLabel}
          aria-label={ARIA.toCurrency}
          items={convertState.toCountries}
          onSelect={updateToCountries}
          selectedValue={convertState.selectedToCurrency}
        />
      </RowDiv>
      <RowDiv>
        <InputWrapper>
          <NumberInput
            type="number"
            aria-label={ARIA.sourceAmount}
            onChange={validateAmount}
            min={0}
            value={convertState.selectedFromAmount}
            step="0.01"
          />
        </InputWrapper>
        <InputWrapper>
          <NumberInput
            type="number"
            min={0}
            aria-label={ARIA.targetAmount}
            disabled
            value={convertState.selectedToAmount}
          />
        </InputWrapper>
      </RowDiv>

      <ButtonWrapper>
        {convertState.showAdd && (
          <AddButton type="button" value={CONVERTER.add} onClick={addConverter} />
        )}
        {!convertState.showAdd && (
          <DeleteButton type="button" value={CONVERTER.delete} onClick={deleteConvert} />
        )}
      </ButtonWrapper>
    </section>
  );
};

CurrencyConverter.propTypes = {
  selectedCountries: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      id: PropTypes.string,
      name: PropTypes.string,
    })
  ),
  idx: PropTypes.string.isRequired,
  onExchangeClick: PropTypes.func.isRequired,
  onAddExchange: PropTypes.func.isRequired,
  onDeleteExchange: PropTypes.func.isRequired,
  exchangeObj: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fromCurrency: PropTypes.string.isRequired,
    fromAmount: PropTypes.number.isRequired,
    toCurrency: PropTypes.string.isRequired,
    toAmount: PropTypes.number.isRequired,
  }),
};

export default CurrencyConverter;
