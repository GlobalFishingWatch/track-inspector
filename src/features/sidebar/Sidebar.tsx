import React, { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cx from 'classnames'
import { Type } from '@globalfishingwatch/layer-composer'
import { DataviewWorkspace } from '@globalfishingwatch/api-client'
import { updateQueryParams } from 'routes/routes.actions'
import { selectSidebarQuery } from 'routes/routes.selectors'
import { selectVesselsWithConfig, VesselWithConfig } from 'features/vessels/vessels.selectors'
import { selectDataviewByGeneratorConfigType } from 'features/dataviews/dataviews.selectors'
import { ReactComponent as IconArrow } from 'assets/icons/arrow-left.svg'
import { ReactComponent as Logo } from 'assets/images/gfw-carrier-vessels.svg'
import styles from './Sidebar.module.css'
import { CARRIER_PORTAL_URL } from 'config'

const Toggle = ({ backgroundColor }: { backgroundColor: string }) => {
  return <button className={styles.toggle} style={{ backgroundColor }}></button>
}

const Sidebar = () => {
  const sidebar = useSelector(selectSidebarQuery)
  const vessels = useSelector(selectVesselsWithConfig)
  const contextLayers = useSelector(selectDataviewByGeneratorConfigType(Type.CartoPolygons))

  const dispatch = useDispatch()
  return (
    <Fragment>
      {sidebar && (
        <div className={styles.content}>
          <header>
            <a target="_blank" href={CARRIER_PORTAL_URL}>
              <Logo />
            </a>
          </header>
          <section>
            <h1>Vessels</h1>
            <ul>
              {vessels.map((vessel: VesselWithConfig) => (
                <li key={vessel.id}>
                  <Toggle backgroundColor={vessel.color as string} />
                  {vessel.name}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h1>Context areas</h1>
            <ul>
              {contextLayers.map((contextLayer: DataviewWorkspace) => (
                <li key={contextLayer.id}>
                  <Toggle backgroundColor={contextLayer.dataview?.config.color} />
                  {contextLayer.dataview?.name}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      <button
        onClick={() => {
          dispatch(updateQueryParams({ sidebar: !sidebar }))
        }}
        className={cx(styles.foldButton, { [styles._folded]: !sidebar })}
      >
        <IconArrow />
      </button>
    </Fragment>
  )
}

export default Sidebar
