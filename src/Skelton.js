import React from 'react';
import styled from 'styled-components';

import CurrencyList from './components/CurrencyList';

const SectionWrapper = styled.section`
  display: flex;
`;

const MainWrapper = styled.main`
  display: flex;
  flex: 4;
`;

const AsideWrapper = styled.aside`
  display: flex;
  flex: 1;
  flex-flow: column;
  background-color: #384652;
  overflow-y: auto;
  height: 100vh;
`;

const Skelton = () => (
  <SectionWrapper>
    <MainWrapper>Hello</MainWrapper>
    <AsideWrapper>
      <CurrencyList />
    </AsideWrapper>
  </SectionWrapper>
);

export default Skelton;
