import { createSelector } from '@reduxjs/toolkit'
import { formatDistance } from 'date-fns'
import { selectDataviews } from 'features/dataviews/dataviews.slice'
import { selectTracks, selectEvents } from 'features/vessels/vessels.slice'
import { Event } from 'types'
import { EVENTS_COLORS } from 'config'
import { DataviewWorkspace } from '@globalfishingwatch/api-client'
import { Generators } from '@globalfishingwatch/layer-composer'
import { selectTimebarMode } from 'routes/routes.selectors'
import { Field } from 'data-transform/trackValueArrayToSegments'

type TimebarTrackSegment = {
  start: number
  end: number
}
type TimebarTrack = {
  segments: TimebarTrackSegment[]
  color: string
}

const selectTracksDataviews = createSelector([selectDataviews], (dataviewWorkspaces) => {
  const dataviews: DataviewWorkspace[] = dataviewWorkspaces.filter(
    (dataviewWorkspace: DataviewWorkspace) => {
      return (
        dataviewWorkspace.dataview?.config.type === Generators.Type.Track &&
        dataviewWorkspace.dataview?.config.visible !== false
      )
    }
  )
  return dataviews
})

export const getTracksData = createSelector(
  [selectTracksDataviews, selectTracks],
  (trackDataviews, tracks) => {
    const tracksSegments: TimebarTrack[] = trackDataviews.map(
      (dataviewWorkspace: DataviewWorkspace) => {
        const id = dataviewWorkspace.datasetParams.id
        const track = tracks[id]
        const trackSegments: TimebarTrackSegment[] = !track
          ? []
          : tracks[id].map((segment) => {
              return {
                start: segment[0].timestamp || 0,
                end: segment[segment.length - 1].timestamp || 0,
              }
            })
        return {
          segments: trackSegments,
          color: dataviewWorkspace.dataview?.config.color,
        }
      }
    )

    return tracksSegments
  }
)

export const getTracksGraphs = createSelector(
  [selectTracksDataviews, selectTracks, selectTimebarMode],
  (trackDataviews, tracks, currentTimebarMode) => {
    const graphs = trackDataviews.map((dataviewWorkspace: DataviewWorkspace) => {
      const id = dataviewWorkspace.datasetParams.id
      const trackSegments = tracks[id]
      if (!trackSegments) return null
      const color = dataviewWorkspace.dataview?.config.color
      const segmentsWithCurrentFeature = trackSegments.map((segment) => {
        return segment.map((pt) => {
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

export const getEventsForTracks = createSelector(
  [selectTracksDataviews, selectEvents, selectTracks],
  (trackDataviews, events) => {
    const vesselsEvents = trackDataviews.map((dataviewWorkspace: DataviewWorkspace) => {
      const id = dataviewWorkspace.datasetParams.id
      const vesselEvents = events[id] || []
      return vesselEvents
    })
    return vesselsEvents
  }
)

interface RenderedEvent extends Event {
  color: string
  description: string
}

// Inject colors using type and auth status
export const getEventsWithRenderingInfo = createSelector([getEventsForTracks], (eventsForTrack) => {
  // + add text descriptions
  const eventsWithRenderingInfo: RenderedEvent[][] = eventsForTrack.map((trackEvents: Event[]) => {
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
      description = `${description} for ${formatDistance(event.start, event.end)}`

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
  })
  return eventsWithRenderingInfo
})

// Gets common encounter across several vessels events lists
export const getEncounters = createSelector([getEventsWithRenderingInfo], (trackEvents) => {
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
