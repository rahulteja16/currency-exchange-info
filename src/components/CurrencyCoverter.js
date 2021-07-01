import { faRandom } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useReducer } from 'react';
import styled from 'styled-components';

import CustomDropDown from '../shared/CustomDropdown';
import { ConvertTypes } from '../types';

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
const initialState = {
  fromCountries: [],
  toCountries: [],
  selectedFromCurrency: '',
  selectedFromAmount: 0,
  selectedToCurrency: '',
  selectedToAmount: 0,
  showAdd: true,
};

const convertReducer = (state, action) => {
  switch (action.type) {
    case ConvertTypes.INITIAL_DATA:
      const { selectedCountries, exchangeObj } = action.payload;
      const toCountries = selectedCountries.filter((item) => item.key !== exchangeObj.fromCurrency);
      const fromCountries = selectedCountries.filter((item) => item.key !== exchangeObj.toCurrency);
      return {
        fromCountries: [...fromCountries],
        toCountries: [...toCountries],
        selectedFromCurrency: exchangeObj.fromCurrency,
        selectedToCurrency: exchangeObj.toCurrency,
        selectedFromAmount: exchangeObj.fromAmount,
        selectedToAmount: exchangeObj.toAmount,
        showAdd: true,
      };
    case ConvertTypes.UPDATE_FROM_COUNTRIES:
      const { toCountries: updatedToCountries, selectedFromCurrency: updatedFromCurrencyVal } =
        action.payload;
      const fromUpdatedState = { ...state };
      fromUpdatedState.toCountries = updatedToCountries;
      fromUpdatedState.selectedFromCurrency = updatedFromCurrencyVal;
      return fromUpdatedState;
    case ConvertTypes.UPDATE_TO_COUNTRIES:
      const { fromCountries: updatedFromCountries, selectedToCurrency: updatedToCurrencyVal } =
        action.payload;
      const toUpdatedState = { ...state };
      toUpdatedState.fromCountries = updatedFromCountries;
      toUpdatedState.selectedToCurrency = updatedToCurrencyVal;
      return toUpdatedState;
    case ConvertTypes.SWITCH:
      const { switchObj } = action.payload;
      return switchObj;
    case ConvertTypes.TOGGLE_ADD:
      const newState = { ...state };
      newState.showAdd = action.payload.status;
      return newState;
    default:
      return state;
  }
};

const CurrencyConverter = ({
  selectedCountries,
  exchangeObj,
  idx,
  onExchangeClick,
  onAddExchange,
  onDeleteExchange,
}) => {
  const [convertState, dispatch] = useReducer(convertReducer, initialState);

  useEffect(() => {
    dispatch({
      type: ConvertTypes.INITIAL_DATA,
      payload: {
        selectedCountries,
        exchangeObj,
      },
    });
  }, [dispatch, exchangeObj, selectedCountries]);

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
        convertState.selectedFromAmount !== '' ? parseInt(convertState.selectedFromAmount) : 0,
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
        convertState.selectedFromAmount !== '' ? parseInt(convertState.selectedFromAmount) : 0,
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

    const switchObj = {
      fromCountries: toCountries,
      toCountries: fromCountries,
      selectedFromCurrency: selectedToCurrency,
      selectedFromAmount: selectedToAmount,
      selectedToCurrency: selectedFromCurrency,
      selectedToAmount: selectedFromAmount,
      showAdd: true,
    };

    dispatch({
      type: ConvertTypes.SWITCH,
      payload: {
        switchObj,
      },
    });
  };

  const validateAmount = (e) => {
    let obj = {
      fromCurrency: convertState.selectedFromCurrency,
      fromAmount: e.target.value !== '' ? parseInt(e.target.value) : 0,
      toCurrency: convertState.selectedToCurrency,
    };
    onExchangeClick(idx, obj);
  };

  const addConverter = () => {
    dispatch({
      type: ConvertTypes.TOGGLE_ADD,
      payload: {
        status: false,
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
          keyVal="ConvertFrom"
          label="From"
          items={convertState.fromCountries}
          onSelect={updateFromCountries}
          selectedValue={convertState.selectedFromCurrency}
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
          items={convertState.toCountries}
          onSelect={updateToCountries}
          selectedValue={convertState.selectedToCurrency}
        />
      </RowDiv>
      <RowDiv>
        <InputWrapper>
          <NumberInput
            type="number"
            placeholder="Enter Amount"
            aria-label="Enter Source Amount"
            onChange={validateAmount}
            value={convertState.selectedFromAmount}
          />
        </InputWrapper>
        <InputWrapper>
          <NumberInput
            type="number"
            placeholder="Amount"
            aria-label="Target Amount"
            disabled
            value={convertState.selectedToAmount}
          />
        </InputWrapper>
      </RowDiv>

      <ButtonWrapper>
        {convertState.showAdd && <AddButton type="button" value="Add" onClick={addConverter} />}
        {!convertState.showAdd && (
          <DeleteButton type="button" value="Delete" onClick={deleteConvert} />
        )}
      </ButtonWrapper>
    </section>
  );
};

export default CurrencyConverter;
