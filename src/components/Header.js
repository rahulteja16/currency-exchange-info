import React from 'react';
import styled from 'styled-components';
import Logo from '../assets/logo.jpeg';

const HeaderWrapper = styled.header`
  display: flex;
  height: 77px;
  border-bottom: 1px solid #e2e6e8;
`;
const Heading = styled.h1`
  display: flex;
  justify-content: center;
  flex-flow: column;
  padding-left: 1%;
`;

const Image = styled.img`
  height: 75px;
  width: 75px;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  flex-flow: column;
  border-bottom: 2px solid #215b9c;
  margin-left: 2%;
`;

const Anchor = styled.a`
  text-decoration: none;
  color: #215b9c;
`;
const Header = () => {
  return (
    <HeaderWrapper>
      <Heading>
        <Image alt="Logo" src={Logo} />
      </Heading>
      <Nav>
        <Anchor href="/">Home</Anchor>
      </Nav>
    </HeaderWrapper>
  );
};

export default Header;
