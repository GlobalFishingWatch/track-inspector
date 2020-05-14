import React, { Fragment, memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  getTracksData,
  getTracksGraphs,
  getEventsWithRenderingInfo,
  getEncounters,
} from './timebar.selectors'
import { setHighlightedTime, disableHighlightedTime, selectHighlightedTime } from './timebar.slice'
import {
  useTimerangeConnect,
  useBookmarkTimerangeConnect,
  useTimebarModeConnect,
} from 'features/timebar/timebar.hooks'
import { selectGeneratorConfigCurrentEventId } from 'features/dataviews/dataviews.selectors'
import { useViewportConnect } from 'features/map/map.hooks'
import TimebarComponent, {
  TimebarTracks,
  TimebarActivity,
  TimebarTracksEvents,
  TimebarHighlighter,
} from '@globalfishingwatch/map-components/components/timebar'
import Loader from 'features/loaders/Loader'
import { Event, TimebarMode } from 'types/'
import { selectLoader } from 'features/loaders/loaders.selectors'
import styles from './Timebar.module.css'

const TimebarWrapper = () => {
  const { start, end, dispatchTimerange } = useTimerangeConnect()
  const { bookmarkStart, bookmarkEnd, dispatchBookmarkTimerange } = useBookmarkTimerangeConnect()
  const { timebarMode, dispatchTimebarMode } = useTimebarModeConnect()
  const { dispatchViewport } = useViewportConnect()
  const tracks = useSelector(getTracksData)
  const tracksEvents = useSelector(getEventsWithRenderingInfo)
  const encounters = useSelector(getEncounters)
  const highlightedTime = useSelector(selectHighlightedTime)
  const loading = useSelector(selectLoader('timebar'))
  const currentEventId = useSelector(selectGeneratorConfigCurrentEventId)

  const tracksGraph = useSelector(getTracksGraphs)

  const dispatch = useDispatch()

  const disableEncounters = timebarMode === TimebarMode.encounters && tracksEvents.length !== 2

  return (
    <Fragment>
      <TimebarComponent
        enablePlayback
        start={start}
        end={end}
        absoluteStart={'2017-01-01T00:00:00.000Z'}
        absoluteEnd={'2020-01-01T00:00:00.000Z'}
        onChange={dispatchTimerange}
        bookmarkStart={bookmarkStart}
        bookmarkEnd={bookmarkEnd}
        showLastUpdate={false}
        onBookmarkChange={dispatchBookmarkTimerange}
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
              {(timebarMode === TimebarMode.events || timebarMode === TimebarMode.encounters) && (
                <Fragment>
                  {tracks.length && !disableEncounters && (
                    <TimebarTracks
                      key="tracks"
                      outerScale={props.outerScale}
                      graphHeight={props.graphHeight}
                      tracks={tracks}
                    />
                  )}
                  {tracksEvents.length && (
                    <Fragment>
                      {disableEncounters ? (
                        <div className={styles.noEncounters}>
                          Can't display encounters for{' '}
                          {tracks.length === 1 ? 'a single vessel' : 'more than two vessels'}
                        </div>
                      ) : (
                        <TimebarTracksEvents
                          key="events"
                          outerScale={props.outerScale}
                          outerWidth={props.outerWidth}
                          graphHeight={props.graphHeight}
                          tooltipContainer={props.tooltipContainer}
                          tracksEvents={
                            timebarMode === TimebarMode.encounters ? encounters : tracksEvents
                          }
                          preselectedEventId={currentEventId}
                          onEventClick={(event: Event) => {
                            dispatchViewport({
                              latitude: event.position.lat,
                              longitude: event.position.lon,
                            })
                          }}
                        />
                      )}
                    </Fragment>
                  )}
                </Fragment>
              )}
              {timebarMode === TimebarMode.speed && tracks.length && (
                <TimebarActivity
                  key="trackActivity"
                  graphHeight={props.graphHeight}
                  svgTransform={props.svgTransform}
                  overallScale={props.overallScale}
                  outerScale={props.outerScale}
                  absoluteEnd={props.absoluteEnd}
                  outerWidth={props.outerWidth}
                  // opacity={0.4}
                  // curve="curveBasis"
                  graphTracks={tracksGraph}
                />
              )}
              {highlightedTime && (
                <TimebarHighlighter
                  outerScale={props.outerScale}
                  graphHeight={props.graphHeight}
                  tooltipContainer={props.tooltipContainer}
                  hoverStart={highlightedTime.start}
                  hoverEnd={highlightedTime.end}
                  activity={timebarMode === TimebarMode.speed ? tracksGraph : null}
                  unit="knots"
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
            dispatchTimebarMode(event.target.value)
          }}
          value={timebarMode}
        >
          <option key={TimebarMode.events} value={TimebarMode.events}>
            {TimebarMode.events}
          </option>
          <option key={TimebarMode.encounters} value={TimebarMode.encounters}>
            {TimebarMode.encounters}
          </option>
          <option key={TimebarMode.speed} value={TimebarMode.speed}>
            {TimebarMode.speed}
          </option>
        </select>
        <div className={styles.graphSelectorArrow}>{/* <Icon icon="graph" /> */}</div>
      </div>
    </Fragment>
  )
}

export default memo(TimebarWrapper)
