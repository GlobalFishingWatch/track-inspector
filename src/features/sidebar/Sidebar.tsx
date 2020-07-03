import React, { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cx from 'classnames'
import { Generators } from '@globalfishingwatch/layer-composer'
import CountryFlag from '@globalfishingwatch/ui-components/dist/countryflag'
import { Dataview } from '@globalfishingwatch/dataviews-client'
import { updateQueryParams } from 'routes/routes.actions'
import { selectSidebarQuery } from 'routes/routes.selectors'
import { selectVesselsInfo } from 'features/vessels/vessels.selectors'
import { selectDataviewByGeneratorConfigType } from 'features/dataviews/dataviews.selectors'
import { ReactComponent as IconArrow } from 'assets/icons/arrow-left.svg'
import { ReactComponent as Logo } from 'assets/images/gfw-carrier-vessels.svg'
import { CARRIER_PORTAL_URL } from 'config'
import { ReactComponent as IconInfo } from 'assets/icons/info.svg'
import styles from './Sidebar.module.css'

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
  const vessels = useSelector(selectVesselsInfo)
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
              {vessels.map((vessel) => (
                <li key={vessel.dataview.uid}>
                  <Toggle
                    backgroundColor={vessel.dataview.view?.color as string}
                    loading={!vessel.loaded}
                  />
                  {vessel.data.name || ' loading...'}
                  {vessel.loaded && (
                    <div className={styles.details}>
                      <div className={styles.property}>
                        <label>IMO</label>
                        <span>{vessel.data.imo || '-'}</span>
                      </div>
                      <div className={styles.property}>
                        <label>Last MMSI</label>
                        <span>{vessel.data.lastMMSI || '-'}</span>
                      </div>
                      <div className={styles.property}>
                        <label>Last Flag</label>
                        {vessel.data.lastFlag && <CountryFlag iso={vessel.data.lastFlag} />}
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
              {contextLayers.map((contextLayer: Dataview) => (
                <li key={contextLayer.id}>
                  {/* TODO use visible to toggle on or off */}
                  <Toggle backgroundColor={contextLayer.view!.color as string} />
                  {contextLayer.name}
                  {contextLayer.description && (
                    <span
                      className={styles.info}
                      aria-label={contextLayer.description}
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
