import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import GFWAPI from '@globalfishingwatch/api-client'
import useGFWLogin from '@globalfishingwatch/api-client/dist/react-hook'
import { selectSidebarQuery } from '../routes/routes.selectors'
import styles from './App.module.css'
import Loader from '../loaders/Loader'
import Timebar from '../timebar/Timebar'
import Sidebar from '../sidebar/Sidebar'

const Map = React.lazy(() => import('../map/Map'))

function App() {
  const { loading, logged } = useGFWLogin(GFWAPI)

  const sidebar = useSelector(selectSidebarQuery)

  if (!loading && !logged) {
    window.location.href = GFWAPI.getLoginUrl(window.location.toString())
  }

  return (
    <div className={styles.app}>
      <div className={cx(styles.sidebar, { [styles._noSidebar]: !sidebar })}>
        <Sidebar />
      </div>
      <Suspense fallback={<Loader />}>
        <div className={styles.map}>
          <Map />
        </div>
      </Suspense>
      <div className={styles.timebar}>
        <Timebar />
      </div>
    </div>
  )
}

export default App
