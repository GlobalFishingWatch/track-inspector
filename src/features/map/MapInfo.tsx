import React, { useMemo } from 'react'
import { ScaleControl } from 'react-map-gl'
import { format } from 'date-fns'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { useViewportConnect } from './map.hooks'
import styles from './MapInfo.module.css'

const MapInfo = () => {
  const { zoom } = useViewportConnect()
  const { start, end } = useTimerangeConnect()

  const formattedTime = useMemo(() => {
    const startFmt = format(new Date(start), 'PPp')
    const endFmt = format(new Date(end), 'PPp')
    return `${startFmt} - ${endFmt}`
  }, [start, end])

  return (
    <div className={styles.info}>
      <div className={styles.scale}>
        {zoom > 3 && <ScaleControl maxWidth={100} unit="nautical" />}
      </div>
      <div>{formattedTime}</div>
    </div>
  )
}

export default MapInfo
