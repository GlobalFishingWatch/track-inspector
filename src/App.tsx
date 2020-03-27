import React, { Suspense } from 'react'
import GFWAPI from '@globalfishingwatch/api-client'
import useGFWLogin from '@globalfishingwatch/api-client/dist/react-hook'
import TimebarWrapper from './TimebarWrapper.container'
import './App.css'
import './Loader.css'
import Loader from './Loader'

const Map = React.lazy(() => import('./Map.container'))

function App() {
  const { loading, logged } = useGFWLogin(GFWAPI)

  if (!loading && !logged) {
    window.location.href = GFWAPI.getLoginUrl(window.location.toString())
  }

  return (
    <>
      <Suspense fallback={<Loader />}>
        <Map />
      </Suspense>
      <TimebarWrapper />
    </>
  )
}

export default App
