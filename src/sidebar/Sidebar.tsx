import React, { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cx from 'classnames'
import { GeneratorConfig, Type } from '@globalfishingwatch/layer-composer'
import { updateQueryParams } from 'routes/routes.actions'
import { selectSidebarQuery } from 'routes/routes.selectors'
import { selectGeneratorConfigByType } from 'map/map.selectors'
import { ReactComponent as IconArrow } from 'assets/icons/arrow-left.svg'
import { ReactComponent as Logo } from 'assets/images/logo-gfw.svg'
import styles from './Sidebar.module.css'

const Toggle = ({ backgroundColor }: { backgroundColor: string }) => {
  return <button className={styles.toggle} style={{ backgroundColor }}></button>
}

const Sidebar = () => {
  const sidebar = useSelector(selectSidebarQuery)
  const contextLayers = useSelector(selectGeneratorConfigByType(Type.CartoPolygons, true))
  const tracks = useSelector(selectGeneratorConfigByType(Type.Track))
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
              {tracks.map((track: GeneratorConfig) => (
                <li key={track.id}>
                  {/* TODO Cant import TrackGeneratorConfig for ssome reason :/ */}
                  <Toggle backgroundColor={(track as any).color} />
                  {track.id}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h1>Context areas</h1>
            <ul>
              {contextLayers.map((contextLayer: GeneratorConfig) => (
                <li key={contextLayer.id}>
                  <Toggle backgroundColor={(contextLayer as any).color} />
                  {contextLayer.id}
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
