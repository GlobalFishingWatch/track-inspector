import React, { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cx from 'classnames'
import { TrackGeneratorConfig, Type } from '@globalfishingwatch/layer-composer'
import { DataviewWorkspace } from '@globalfishingwatch/api-client'
import { updateQueryParams } from 'routes/routes.actions'
import { selectSidebarQuery } from 'routes/routes.selectors'
import { selectDataviewByGeneratorConfigType } from 'features/dataviews/dataviews.selectors'
import { Vessel } from 'features/vessels/vessels.slice'
import { selectVesselsWithConfig } from 'features/vessels/vessels.selectors'
import { ReactComponent as IconArrow } from 'assets/icons/arrow-left.svg'
import { ReactComponent as Logo } from 'assets/images/logo-gfw.svg'
import styles from './Sidebar.module.css'

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
            <Logo />
          </header>
          <section>
            <h1>Vessels</h1>
            <ul>
              {vessels.map((vessel: Vessel & TrackGeneratorConfig) => (
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
