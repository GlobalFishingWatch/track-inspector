import React from 'react'
import Timebar, { TimebarTracks } from '@globalfishingwatch/map-components/components/timebar'
import Loader from './Loader'

const TimebarWrapper = (props: any) => {
  const { start, end, tracks, setTimerange, loading } = props

  return (
    <div className="timebar">
      <Timebar
        enablePlayback
        start={start}
        end={end}
        absoluteStart={'2012-01-01T00:00:00.000Z'}
        absoluteEnd={'2020-01-01T00:00:00.000Z'}
        onChange={(start: string, end: string) => {
          // TODO needs to be debounced like viewport
          setTimerange(start, end)
        }}
      >
        {(props: any) =>
          loading ? (
            <Loader />
          ) : (
            <>{tracks.length && <TimebarTracks key="tracks" {...props} tracks={tracks} />}</>
          )
        }
      </Timebar>
    </div>
  )
}

export default TimebarWrapper
