import React, { useState } from 'react'
import Timebar, { TimebarTracks } from '@globalfishingwatch/map-components/components/timebar'
import Loader from './Loader'
import './TimebarWrapper.css'

enum Graph {
  Encounters = 'Encounters',
  Speed = 'Speed',
}

const TimebarWrapper = (props: any) => {
  const { start, end, tracks, setTimerange, loading } = props

  const [currentGraph, setCurrentGraph] = useState(Graph.Speed)

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
            <>
              {tracks.length && currentGraph === Graph.Encounters && (
                <TimebarTracks key="tracks" {...props} tracks={tracks} />
              )}
              {tracks.length && currentGraph === Graph.Speed && <div></div>}
            </>
          )
        }
      </Timebar>
      <div className="graphSelector">
        <select
          className="graphSelectorSelect"
          onChange={(event) => {
            setCurrentGraph(event.target.value as Graph)
          }}
          value={currentGraph}
        >
          <option key={Graph.Encounters} value={Graph.Encounters}>
            {Graph.Encounters}
          </option>
          <option key={Graph.Speed} value={Graph.Speed}>
            {Graph.Speed}
          </option>
        </select>
        <div className="graphSelectorArrow">{/* <Icon icon="graph" /> */}</div>
      </div>
    </div>
  )
}

export default TimebarWrapper
