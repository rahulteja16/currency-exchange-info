import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { Loader } from '../shared/Loader';

const HeadingWrapper = styled.h3`
  color: white;
  text-align: center;
  letter-spacing: 0.2px;
  font-size: 15px;
  margin: 30px 0;
`;

const LI = styled.li`
  list-style-type: none;
  padding: 2% 0;
  color: #acb4bc;
  &:hover {
    color: #ffffff;
  }
`;

const UL = styled.ul`
  padding-left: 8px;
  background-color: #40505f;
  margin-bottom: 3px;
`;

const ItemRow = styled.div`
  display: flex;
  flex-flow: row;
  font-size: 14px;
  font-weight: normal;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  cursor: pointer;
`;

const H5 = styled.h5`
  margin-top: 3px;
  margin-left: 5px;
`;
const Button = styled.input`
  width: 100%;
  height: 40px;
  background-color: #3588e7;
  color: #ffffff;
  border: none;
  cursor: pointer;
`;

const LoaderWrapper = styled.div`
  position: relative;
  height: 90vh;
`;

const CurrencyList = ({ countries, status }) => {
  const onCheckBoxClick = (e) => {
    e.preventDefault();
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <section>
      <HeadingWrapper>
        <FontAwesomeIcon icon={faGlobe} />
        Select Currencies
      </HeadingWrapper>

      {status === 'loading' && (
        <LoaderWrapper>
          <Loader color="#ffffff" />
        </LoaderWrapper>
      )}

      {status === 'idel' && (
        <form onSubmit={handleSubmit}>
          <UL>
            {countries &&
              countries.map((country) => {
                return (
                  <LI key={country.id}>
                    <ItemRow>
                      <input
                        type="checkbox"
                        defaultChecked={country.selected}
                        value={country.code}
                        name={country.code}
                        onChange={onCheckBoxClick}
                      />
                      <H5>{country.name}</H5>
                    </ItemRow>
                  </LI>
                );
              })}
          </UL>
          <Button type="submit" value="Save" />
        </form>
      )}
    </section>
  );
};

export default CurrencyList;
