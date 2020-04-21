import React, { Fragment } from 'react'
import GFWAPI from '@globalfishingwatch/api-client'
import useGFWLogin from '@globalfishingwatch/api-client/dist/react-hook'
import './App.css'
import Map from '../map/Map'
import Timebar from '../timebar/Timebar'

function App() {
  const { loading, logged } = useGFWLogin(GFWAPI)

  if (!loading && !logged) {
    window.location.href = GFWAPI.getLoginUrl(window.location.toString())
  }

  return (
    <Fragment>
      <Map />
      <Timebar />
    </Fragment>
  )
}

export default App
