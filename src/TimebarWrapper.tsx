import React, { Fragment, memo, useState, useMemo } from 'react'
import Timebar, {
  TimebarTracks,
  TimebarActivity,
  TimebarVesselEvents,
  TimebarHighlighter,
  geoJSONTrackToTimebarFeatureSegments,
} from '@globalfishingwatch/map-components/components/timebar'
import Loader from './Loader'
import './TimebarWrapper.css'

enum Graph {
  Encounters = 'Encounters',
  Speed = 'Speed',
}

const tracksToSegments = (tracks: any[]) => {
  return tracks.map((track: any) => ({
    segments: geoJSONTrackToTimebarFeatureSegments(track.geojson),
    color: track.color,
  }))
}

const segmentsToGraph = (tracks: any[], currentGraph: string) => {
  return tracks.map((track) => {
    const segments = track.segments
    const segmentsWithCurrentFeature = segments.map((segment: any) =>
      segment.map((item: any) => ({
        ...item,
        value: item[`${currentGraph.toLowerCase()}s`],
      }))
    )
    return {
      segmentsWithCurrentFeature,
      color: track.color,
    }
  })
}

const TimebarWrapper = (props: any) => {
  const {
    start,
    end,
    tracks,
    events,
    loading,
    highlightedTime,
    setTimerange,
    setHighlightedTime,
  } = props

  const [currentGraph, setCurrentGraph] = useState(Graph.Encounters)

  const segments = useMemo(() => tracksToSegments(tracks), [tracks])
  const graph = useMemo(() => {
    return segmentsToGraph(segments, currentGraph)
  }, [segments, currentGraph])

  console.log(events)

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
        onMouseMove={setHighlightedTime}
      >
        {(props: any) => {
          return loading ? (
            <Loader />
          ) : (
            <Fragment>
              {tracks.length && currentGraph === Graph.Encounters && (
                <TimebarTracks key="tracks" {...props} tracks={tracks} />
              )}
              {events.length && currentGraph === Graph.Encounters && (
                <TimebarVesselEvents
                  key="events"
                  events={events}
                  outerStart={props.outerStart}
                  outerEnd={props.outerEnd}
                  outerScale={props.outerScale}
                  outerWidth={props.outerWidth}
                  outerHeight={props.outerHeight}
                  graphHeight={props.graphHeight}
                />
              )}
              {tracks.length && currentGraph === Graph.Speed && (
                <TimebarActivity
                  key="trackActivity"
                  graphHeight={props.graphHeight}
                  svgTransform={props.svgTransform}
                  overallScale={props.overallScale}
                  outerWidth={props.outerWidth}
                  // opacity={0.4}
                  // curve="curveBasis"
                  graphTracks={graph}
                />
              )}
              {highlightedTime && (
                <TimebarHighlighter
                  outerScale={props.outerScale}
                  graphHeight={props.graphHeight}
                  tooltipContainer={props.tooltipContainer}
                  hoverStart={highlightedTime.start}
                  hoverEnd={highlightedTime.end}
                />
              )}
            </Fragment>
          )
        }}
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

export default memo(TimebarWrapper)
