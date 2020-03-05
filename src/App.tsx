import React from 'react';
import GFWAPI, { getLoginUrl } from '@globalfishingwatch/api-client'
import useGFWLogin from '@globalfishingwatch/api-client/dist/react-hook'
import Map from './Map.container'
import TimebarWrapper from './TimebarWrapper.container';
import './App.css';

function App() {
  const { loading, logged } = useGFWLogin(GFWAPI)

  // TODO add spinner

  if (!loading && !logged) {
    window.location.href = getLoginUrl(window.location.toString())
  }

  return (
    <>
      <Map />
      <TimebarWrapper />
    </>
  );
}

export default App;

