import React, { useMemo } from 'react'
import { ScaleControl } from 'react-map-gl'
import { DateTime } from 'luxon'

import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { LatLon } from 'types'
import toFixed from 'util/toFixed'

import { useViewportConnect } from './map.hooks'
import styles from './MapInfo.module.css'

const A_DAY = 1000 * 60 * 60 * 24

const MapInfo = ({ center }: { center: LatLon | null }) => {
  const { zoom } = useViewportConnect()
  const { start, end } = useTimerangeConnect()

  const formattedTime = useMemo(() => {
    const startDT = DateTime.fromISO(start).toUTC()
    const endDT = DateTime.fromISO(end).toUTC()
    let stFormatted = startDT.toLocaleString(DateTime.DATE_MED)
    let endFormatted = endDT.toLocaleString(DateTime.DATE_MED)
    const timeΔ = new Date(end).getTime() - new Date(start).getTime()
    if (timeΔ < A_DAY) {
      stFormatted = [stFormatted, startDT.toLocaleString(DateTime.TIME_24_SIMPLE), 'UTC'].join(' ')
      endFormatted = [endFormatted, endDT.toLocaleString(DateTime.TIME_24_SIMPLE), 'UTC'].join(' ')
    }
    return `${stFormatted} - ${endFormatted}`
  }, [start, end])

  return (
    <div className={styles.info}>
      <div className={styles.scale}>
        {zoom > 3 && <ScaleControl maxWidth={100} unit="nautical" />}
      </div>
      {center && (
        <div>
          {toFixed(center.latitude, 4)} {toFixed(center.longitude, 4)}
        </div>
      )}
      <div>{formattedTime}</div>
    </div>
  )
}

export default MapInfo
