import React, { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cx from 'classnames'
import { Generators } from '@globalfishingwatch/layer-composer'
import { DataviewWorkspace } from '@globalfishingwatch/dataviews-client'
import CountryFlag from '@globalfishingwatch/ui-components/dist/countryflag'
import { updateQueryParams } from 'routes/routes.actions'
import { selectSidebarQuery } from 'routes/routes.selectors'
import { selectVesselsWithConfig, VesselWithConfig } from 'features/vessels/vessels.selectors'
import { selectDataviewByGeneratorConfigType } from 'features/dataviews/dataviews.selectors'
import { ReactComponent as IconArrow } from 'assets/icons/arrow-left.svg'
import { ReactComponent as Logo } from 'assets/images/gfw-carrier-vessels.svg'
import styles from './Sidebar.module.css'
import { CARRIER_PORTAL_URL } from 'config'
import { ReactComponent as IconInfo } from 'assets/icons/info.svg'

const Toggle = ({ backgroundColor, loading }: { backgroundColor: string; loading?: boolean }) => {
  return (
    <button
      className={cx(styles.toggle, { [styles.loading]: loading })}
      style={{ backgroundColor, borderColor: backgroundColor }}
    ></button>
  )
}

const Sidebar = () => {
  const sidebar = useSelector(selectSidebarQuery)
  const vessels = useSelector(selectVesselsWithConfig)
  const contextLayers = useSelector(
    selectDataviewByGeneratorConfigType(Generators.Type.CartoPolygons)
  )
  const dispatch = useDispatch()
  return (
    <Fragment>
      {sidebar && (
        <div className={styles.content}>
          <header>
            <a target="_blank" rel="noopener noreferrer" href={CARRIER_PORTAL_URL}>
              <Logo />
            </a>
          </header>
          <section>
            <h1>Vessels</h1>
            <ul>
              {vessels.map((vessel: VesselWithConfig) => (
                <li key={vessel.id}>
                  <Toggle
                    backgroundColor={vessel.color as string}
                    loading={vessel.trackLoading || !vessel.name}
                  />
                  {vessel.name || ' loading...'}
                  {vessel.name && (
                    <div className={styles.details}>
                      <div className={styles.property}>
                        <label>IMO</label>
                        <span>{vessel.imo || '-'}</span>
                      </div>
                      <div className={styles.property}>
                        <label>Last MMSI</label>
                        <span>{vessel.lastMMSI || '-'}</span>
                      </div>
                      <div className={styles.property}>
                        <label>Last Flag</label>
                        {vessel.lastFlag && <CountryFlag iso={vessel.lastFlag} />}
                      </div>
                    </div>
                  )}
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
                  {contextLayer.dataview?.description && (
                    <span
                      className={styles.info}
                      aria-label={contextLayer.dataview?.description}
                      data-tip-wrap="multiline"
                    >
                      <IconInfo />
                    </span>
                  )}
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
