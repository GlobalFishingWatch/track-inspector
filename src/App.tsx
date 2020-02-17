import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import GFWAPI, { getLoginUrl } from '@globalfishingwatch/api-client'
import useGFWLogin from '@globalfishingwatch/api-client/dist/react-hook'
import Map from './Map'

function App() {
  const { loading, logged } = useGFWLogin(GFWAPI)

  // TODO add spinner

  if (!loading && !logged) {
    window.location.href = getLoginUrl(window.location.toString())
  }

  return <Map />
}

export default App;

