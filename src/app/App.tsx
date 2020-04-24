import React, { Suspense, Fragment } from 'react'
import GFWAPI from '@globalfishingwatch/api-client'
import useGFWLogin from '@globalfishingwatch/api-client/dist/react-hook'
import './App.css'
import Loader from '../loaders/Loader'
import Timebar from '../timebar/Timebar'

const Map = React.lazy(() => import('../map/Map'))

function App() {
  const { loading, logged } = useGFWLogin(GFWAPI)

  if (!loading && !logged) {
    window.location.href = GFWAPI.getLoginUrl(window.location.toString())
  }

  return (
    <Fragment>
      <Suspense fallback={<Loader />}>
        <Map />
      </Suspense>
      <Timebar />
    </Fragment>
  )
}

export default App
