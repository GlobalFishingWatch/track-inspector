import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cx from 'classnames'
import formatcoords from 'formatcoords'
import MiniGlobe from '@globalfishingwatch/map-components/components/miniglobe'
import { MiniGlobeBounds } from '@globalfishingwatch/map-components/types/components/miniglobe'
import { updateQueryParams } from 'routes/routes.actions'
import { selectViewport } from 'routes/routes.selectors'
import Rulers from 'features/rulers/Rulers'
import styles from './MapControls.module.css'
import { ReactComponent as IconPlus } from 'assets/icons/plus.svg'
import { ReactComponent as IconMinus } from 'assets/icons/minus.svg'

const MapControls = ({ bounds }: { bounds: MiniGlobeBounds | null }) => {
  const { latitude, longitude, zoom } = useSelector(selectViewport)
  const dispatch = useDispatch()

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
        {bounds && (
          <MiniGlobe
            center={[latitude, longitude]}
            zoom={zoom}
            bounds={bounds}
            viewportThickness={1}
            size={70}
          />
        )}
      </div>
      <button
        className={styles.mapControl}
        onClick={() => {
          dispatch(updateQueryParams({ zoom: zoom + 1 }))
        }}
        aria-label="Increase zoom"
      >
        <IconPlus />
      </button>
      <button
        className={styles.mapControl}
        onClick={() => {
          dispatch(updateQueryParams({ zoom: zoom - 1 }))
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
