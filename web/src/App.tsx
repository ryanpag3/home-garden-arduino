import React from 'react';
import useAxios from 'axios-hooks';
import BumpChart from './components/BumpChart';
import styled from 'styled-components';

function App() {
  return (
      <Container>
        <BumpChart/>
      </Container>
  );
}

const Container = styled.div`
  height: 100%;
  width: 100%;
`;

export default App;