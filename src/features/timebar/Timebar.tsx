import React, { Fragment, memo, useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getTracksData, getEventsWithRenderingInfo } from './timebar.selectors'
import { setHighlightedTime, disableHighlightedTime, selectHighlightedTime } from './timebar.slice'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectGeneratorConfigCurrentEventId } from 'features/dataviews/dataviews.selectors'
import { useViewportConnect } from 'features/map/map.hooks'
import TimebarComponent, {
  TimebarTracks,
  TimebarActivity,
  TimebarTracksEvents,
  TimebarHighlighter,
  geoJSONTrackToTimebarFeatureSegments,
} from '@globalfishingwatch/map-components/components/timebar'
import Loader from 'features/loaders/Loader'
import { Event } from 'types/'
import { selectLoader } from 'features/loaders/loaders.selectors'
import styles from './Timebar.module.css'
import { selectDataviews, addDataviews, removeDataviews } from 'features/dataviews/dataviews.slice'
import { DataviewWorkspace } from '@globalfishingwatch/api-client'

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

const TimebarWrapper = () => {
  const { start, end, dispatchTimerange } = useTimerangeConnect()
  const { dispatchViewport } = useViewportConnect()
  const tracks = useSelector(getTracksData)
  const tracksEvents = useSelector(getEventsWithRenderingInfo)
  const highlightedTime = useSelector(selectHighlightedTime)
  const loading = useSelector(selectLoader('timebar'))
  const currentEventId = useSelector(selectGeneratorConfigCurrentEventId)
  const dataviews = useSelector(selectDataviews)

  // get carrier and fishing id from dataviews
  const { carrierId, fishingId } = useMemo(() => {
    const carrierDataview = dataviews.find(
      (dataviewWorkspace: DataviewWorkspace) =>
        dataviewWorkspace.dataview && dataviewWorkspace.dataview.id === 'trackCarrier'
    )
    const fishingDataview = dataviews.find(
      (dataviewWorkspace: DataviewWorkspace) =>
        dataviewWorkspace.dataview && dataviewWorkspace.dataview.id === 'trackFishing'
    )
    return {
      carrierId: carrierDataview && carrierDataview.datasetParams.id,
      fishingId: fishingDataview && fishingDataview.datasetParams.id,
    }
  }, [dataviews])

  const dispatch = useDispatch()

  const [currentGraph, setCurrentGraph] = useState(Graph.Encounters)

  const segments = useMemo(() => tracksToSegments(tracks), [tracks])
  const graph = useMemo(() => {
    return segmentsToGraph(segments, currentGraph)
  }, [segments, currentGraph])

  return (
    <Fragment>
      <TimebarComponent
        enablePlayback
        start={start}
        end={end}
        absoluteStart={'2012-01-01T00:00:00.000Z'}
        absoluteEnd={'2020-01-01T00:00:00.000Z'}
        onChange={dispatchTimerange}
        onMouseMove={(clientX: number, scale: (arg: number) => Date) => {
          if (clientX === null) {
            dispatch(disableHighlightedTime())
            return
          }
          const start = scale(clientX - 10).toISOString()
          const end = scale(clientX + 10).toISOString()
          dispatch(setHighlightedTime({ start, end }))
        }}
      >
        {(props: any) => {
          return loading ? (
            <Loader />
          ) : (
            <Fragment>
              {tracks.length && currentGraph === Graph.Encounters && (
                <TimebarTracks key="tracks" {...props} tracks={tracks} />
              )}
              {tracksEvents.length && currentGraph === Graph.Encounters && (
                <TimebarTracksEvents
                  key="events"
                  outerScale={props.outerScale}
                  outerWidth={props.outerWidth}
                  graphHeight={props.graphHeight}
                  tooltipContainer={props.tooltipContainer}
                  tracksEvents={tracksEvents}
                  preselectedEventId={currentEventId}
                  onEventClick={(event: Event) => {
                    dispatchViewport({
                      latitude: event.position.lat,
                      longitude: event.position.lon,
                    })
                  }}
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
      </TimebarComponent>
      <div className={styles.graphSelector}>
        <select
          className={styles.graphSelectorSelect}
          onChange={(event) => {
            if (event.target.value === Graph.Speed) {
              dispatch(
                // TODO collect IDs
                addDataviews([
                  {
                    id: 'speedGraphCarrier',
                    datasetParams: {
                      id: carrierId,
                    },
                  },
                  {
                    id: 'speedGraphFishing',
                    datasetParams: {
                      id: fishingId,
                    },
                  },
                ])
              )
            } else {
              dispatch(removeDataviews(['speedGraphCarrier', 'speedGraphFishing']))
            }
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
        <div className={styles.graphSelectorArrow}>{/* <Icon icon="graph" /> */}</div>
      </div>
    </Fragment>
  )
}

export default memo(TimebarWrapper)
