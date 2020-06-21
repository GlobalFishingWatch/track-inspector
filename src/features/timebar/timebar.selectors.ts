import { createSelector } from '@reduxjs/toolkit'
import { DateTime } from 'luxon'
import { Event } from 'types'
import { EVENTS_COLORS } from 'config'
import { selectTimebarMode } from 'routes/routes.selectors'
import { Field } from 'data-transform/trackValueArrayToSegments'
import { selectTrackDataviews } from 'features/dataviews/dataviews.selectors'
import { selectResources } from 'features/dataviews/resources.slice'

type TimebarTrackSegment = {
  start: number
  end: number
}
type TimebarTrack = {
  segments: TimebarTrackSegment[]
  color: string
}

export const selectTracksData = createSelector(
  [selectTrackDataviews, selectResources],
  (trackDataviews, resources) => {
    const tracksSegments: TimebarTrack[] = trackDataviews.map((dataview) => {
      const vesselId = dataview.datasetsParamIds[0]
      const track = resources.find((res) => res.type === 'track' && res.datasetParamId === vesselId)
      const trackSegments: TimebarTrackSegment[] =
        !track || !track.data
          ? []
          : (track as any).data.map((segment: any) => {
              return {
                start: segment[0].timestamp || 0,
                end: segment[segment.length - 1].timestamp || 0,
              }
            })
      return {
        segments: trackSegments,
        color: dataview.view ? (dataview.view.color as string) : '',
      }
    })

    return tracksSegments
  }
)

export const selectTracksGraphs = createSelector(
  [selectTrackDataviews, selectTimebarMode, selectResources],
  (trackDataviews, currentTimebarMode, resources) => {
    const graphs = trackDataviews.map((dataview) => {
      const vesselId = dataview.datasetsParamIds[0]
      const track = resources.find((res) => res.type === 'track' && res.datasetParamId === vesselId)
      if (!track || !track.data) return null
      const color = dataview.view ? (dataview.view.color as string) : ''
      const segmentsWithCurrentFeature = (track as any).data.map((segment: any) => {
        return segment.map((pt: any) => {
          const value = pt[currentTimebarMode as Field]
          return {
            date: pt.timestamp,
            value,
          }
        })
      })
      return {
        color,
        segmentsWithCurrentFeature,
        // TODO Figure out this magic value
        maxValue: 25,
      }
    })
    return graphs
  }
)

const selectEventsForTracks = createSelector(
  [selectTrackDataviews, selectResources],
  (trackDataviews, resources) => {
    const vesselsEvents = trackDataviews.map((dataview) => {
      const vesselId = dataview.datasetsParamIds[0]
      const events = resources.find(
        (res) => res.type === 'events' && res.datasetParamId === vesselId
      )
      if (!events || !events.data) return []
      return events.data as Event[]
    })
    return vesselsEvents
  }
)

interface RenderedEvent extends Event {
  color: string
  description: string
}

// Inject colors using type and auth status
export const selectEventsWithRenderingInfo = createSelector(
  [selectEventsForTracks],
  (eventsForTrack) => {
    const eventsWithRenderingInfo: RenderedEvent[][] = eventsForTrack.map(
      (trackEvents: Event[]) => {
        return trackEvents.map((event: Event) => {
          const vesselName = event.vessel.name || 'This vessel'
          let description
          switch (event.type) {
            case 'encounter':
              if (event.encounter && event.encounter.vessel.name) {
                description = `${vesselName} had encounter with ${event.encounter.vessel.name}`
              } else {
                description = `${vesselName} had encounter with another vessel`
              }
              break
            case 'port':
              if (event.port && event.port.name) {
                description = `${vesselName} docked at ${event.port.name}`
              } else {
                description = `${vesselName} Docked`
              }
              break
            case 'loitering':
              description = `${vesselName} loitered`
              break
            default:
              description = 'Unknown event'
          }
          const duration = DateTime.fromMillis(event.end)
            .diff(DateTime.fromMillis(event.start), ['hours', 'minutes'])
            .toObject()
          description = `${description} for ${duration.hours}hrs ${Math.round(
            duration.minutes as number
          )}mns`

          let colorKey = event.type as string
          if (event.type === 'encounter') {
            colorKey = `${colorKey}${event.encounter?.authorizationStatus}`
          }
          const color = EVENTS_COLORS[colorKey]
          const colorLabels = EVENTS_COLORS[`${colorKey}Labels`]

          return {
            ...event,
            color,
            colorLabels,
            description,
          }
        })
      }
    )
    return eventsWithRenderingInfo
  }
)

// Gets common encounter across several vessels events lists
export const getEncounters = createSelector([selectEventsWithRenderingInfo], (trackEvents) => {
  if (trackEvents.length !== 2) return []
  const allVesselsIds = trackEvents
    .filter((events: RenderedEvent[]) => events.length)
    .map((events: RenderedEvent[]) => events[0].vessel.id)
  return trackEvents
    .map((events: RenderedEvent[]) => {
      return events
        .filter((event: RenderedEvent) => {
          return event.type === 'encounter'
        })
        .filter((event: RenderedEvent) => {
          return event.encounter && allVesselsIds.includes(event.encounter.vessel.id)
        })
        .map((event: RenderedEvent) => {
          return { ...event, height: 16 }
        })
    })
    .slice(0, 1)
})
