import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  width: 40%;
`;
const LabelWrapper = styled.label`
  color: #b3bbc2;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const SelectWrapper = styled.select`
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-bottom: 1px solid black;
  padding-bottom: 10px;
  padding-top: 2px;
  &:focus {
    outline: thin dotted;
    color: #727e89;
  }
`;

const CustomDropDown = ({ label, items, keyVal, selectedValue, onSelect }) => (
  <Wrapper>
    <LabelWrapper htmlFor={keyVal}>{label}</LabelWrapper>
    <SelectWrapper
      name={keyVal}
      onChange={onSelect}
      value={selectedValue}
      data-testid={`select${label}`}
    >
      <option key="default" disabled>
        Please Select
      </option>
      {items.map((item) => (
        <option key={item.id} value={item.code} data-testid={`${label}-${item.code}`}>
          {item.name}
        </option>
      ))}
      x
    </SelectWrapper>
  </Wrapper>
);

CustomDropDown.propTypes = {
  label: PropTypes.string.isRequired,
  keyVal: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string,
    })
  ).isRequired,
  selectedValue: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default CustomDropDown;
