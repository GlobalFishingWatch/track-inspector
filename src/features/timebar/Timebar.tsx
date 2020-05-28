import React, { Fragment, memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import TimebarComponent, {
  TimebarTracks,
  TimebarActivity,
  TimebarTracksEvents,
  TimebarHighlighter,
} from '@globalfishingwatch/timebar'

import {
  useTimerangeConnect,
  useBookmarkTimerangeConnect,
  useTimebarModeConnect,
} from 'features/timebar/timebar.hooks'
import { selectGeneratorConfigCurrentEventId } from 'features/dataviews/dataviews.selectors'
import { useViewportConnect } from 'features/map/map.hooks'
import { Event, TimebarMode } from 'types/'
import { TRACK_START, TRACK_END } from 'config'

import styles from './Timebar.module.css'
import {
  setHighlightedTime,
  disableHighlightedTime,
  selectHighlightedTime,
  setHighlightedEvent,
} from './timebar.slice'
import {
  getTracksData,
  getTracksGraphs,
  getEventsWithRenderingInfo,
  getEncounters,
} from './timebar.selectors'

const TimebarWrapper = () => {
  const { start, end, dispatchTimerange } = useTimerangeConnect()
  const { bookmarkStart, bookmarkEnd, dispatchBookmarkTimerange } = useBookmarkTimerangeConnect()
  const { timebarMode, dispatchTimebarMode } = useTimebarModeConnect()
  const { dispatchViewport } = useViewportConnect()
  const tracks = useSelector(getTracksData)
  const tracksEvents = useSelector(getEventsWithRenderingInfo)
  const encounters = useSelector(getEncounters)
  const highlightedTime = useSelector(selectHighlightedTime)
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
        absoluteStart={TRACK_START.toISOString()}
        absoluteEnd={TRACK_END.toISOString()}
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
        {(props: any) => (
          <Fragment>
            {(timebarMode === TimebarMode.events || timebarMode === TimebarMode.encounters) && (
              <Fragment>
                {tracks.length && !disableEncounters && (
                  <TimebarTracks key="tracks" tracks={tracks} />
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
                        onEventHover={(event: Event) => {
                          dispatch(setHighlightedEvent(event))
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
                // opacity={0.4}
                // curve="curveBasis"
                graphTracks={tracksGraph}
              />
            )}
            {highlightedTime && (
              <TimebarHighlighter
                hoverStart={highlightedTime.start}
                hoverEnd={highlightedTime.end}
                activity={timebarMode === TimebarMode.speed ? tracksGraph : null}
                unit="knots"
              />
            )}
          </Fragment>
        )}
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
