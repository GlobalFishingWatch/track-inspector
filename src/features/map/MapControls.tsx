import React, { useState } from 'react'
import cx from 'classnames'
import formatcoords from 'formatcoords'
import MiniGlobe, { MiniglobeBounds } from '@globalfishingwatch/ui-components/dist/miniglobe'
import Rulers from 'features/rulers/Rulers'
import { ReactComponent as IconPlus } from 'assets/icons/plus.svg'
import { ReactComponent as IconMinus } from 'assets/icons/minus.svg'
import styles from './MapControls.module.css'
import { useViewportConnect } from './map.hooks'

const MapControls = ({ bounds }: { bounds: MiniglobeBounds | null }) => {
  const { zoom, latitude, longitude, dispatchViewport } = useViewportConnect()

  const [showCoords, setShowCoords] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [showDMS, setShowDMS] = useState(false)

  return (
    <div className={styles.mapControls}>
      <div
        className={styles.miniglobe}
        onMouseEnter={() => setShowCoords(true)}
        onMouseLeave={() => setShowCoords(false)}
        onClick={() => setPinned(!pinned)}
      >
        {bounds && <MiniGlobe center={{ latitude, longitude }} bounds={bounds} size={70} />}
      </div>
      <button
        className={styles.mapControl}
        onClick={() => {
          dispatchViewport({ zoom: zoom + 1 })
        }}
        aria-label="Increase zoom"
      >
        <IconPlus />
      </button>
      <button
        className={styles.mapControl}
        onClick={() => {
          dispatchViewport({ zoom: zoom - 1 })
        }}
        aria-label="Decrease zoom"
      >
        <IconMinus />
      </button>
      <Rulers />
      {(pinned || showCoords) && (
        <div
          className={cx(styles.coords, { [styles._pinned]: pinned })}
          onClick={() => setShowDMS(!showDMS)}
        >
          {showDMS
            ? formatcoords(latitude, longitude).format('DDMMssX', {
                latLonSeparator: '',
                decimalPlaces: 2,
              })
            : `${latitude},${longitude}`}
        </div>
      )}
    </div>
  )
}

export default MapControls
