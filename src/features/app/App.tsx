import React, { Suspense, lazy } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import GFWAPI from '@globalfishingwatch/api-client'
import useGFWLogin from '@globalfishingwatch/react-hooks/dist/use-login'
import Button from '@globalfishingwatch/ui-components/dist/button'

import { selectSidebarQuery, selectAlwaysRequireAuthQuery } from 'routes/routes.selectors'
import Loader from 'features/loaders/Loader'
import Timebar from 'features/timebar/Timebar'
import Sidebar from 'features/sidebar/Sidebar'

import '@globalfishingwatch/ui-components/dist/base.css'
import styles from './App.module.css'

const Map = lazy(() => import('../map/Map'))

function App() {
  const { loading, logged } = useGFWLogin(GFWAPI)

  const sidebar = useSelector(selectSidebarQuery)
  const alwaysRequireAuth = useSelector(selectAlwaysRequireAuthQuery)

  if (alwaysRequireAuth) {
    if (!loading && !logged) {
      window.location.href = GFWAPI.getLoginUrl(window.location.toString())
    }
  }

  return (
    <div className={styles.app}>
      <div className={cx(styles.sidebar, { [styles._noSidebar]: !sidebar })}>
        {!alwaysRequireAuth && !logged && (
          <div className={styles.login}>
            <Button
              type="secondary"
              size="small"
              onClick={() => {
                window.location.href = GFWAPI.getLoginUrl(window.location.toString())
              }}
            >
              login
            </Button>
          </div>
        )}
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
