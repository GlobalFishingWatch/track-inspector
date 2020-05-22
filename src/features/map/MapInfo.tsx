import React, { useMemo } from 'react'
import { ScaleControl } from 'react-map-gl'
import { format } from 'date-fns'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { useViewportConnect } from './map.hooks'
import styles from './MapInfo.module.css'
import { LatLon } from 'types'

const toFixed = (value: number) => (Math.round(value * 10000) / 10000).toFixed(4)
const A_DAY = 1000 * 60 * 60 * 24

const MapInfo = ({ center }: { center: LatLon | null }) => {
  const { zoom } = useViewportConnect()
  const { start, end } = useTimerangeConnect()

  const formattedTime = useMemo(() => {
    const timeΔ = new Date(end).getTime() - new Date(start).getTime()
    const timeFormat = timeΔ > A_DAY ? 'PP' : 'PP kk:mm'
    const startFmt = format(new Date(start), timeFormat)
    const endFmt = format(new Date(end), timeFormat)
    return `${startFmt} - ${endFmt}`
  }, [start, end])

  return (
    <div className={styles.info}>
      <div className={styles.scale}>
        {zoom > 3 && <ScaleControl maxWidth={100} unit="nautical" />}
      </div>
      {center && (
        <div>
          {toFixed(center.latitude)} {toFixed(center.longitude)}
        </div>
      )}
      <div>{formattedTime}</div>
    </div>
  )
}

export default MapInfo
