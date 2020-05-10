import { createSelector } from '@reduxjs/toolkit'
import { formatDistance } from 'date-fns'
import { selectDataviews } from 'features/dataviews/dataviews.slice'
import { selectTracks, selectEvents } from 'features/vessels/vessels.slice'
import { Event } from 'types'
import { EVENTS_COLORS } from 'config'
import { DataviewWorkspace } from '@globalfishingwatch/api-client'
import { Type } from '@globalfishingwatch/layer-composer'

type TimebarTrackSegment = {
  start: number
  end: number
}
type TimebarTrack = {
  segments: TimebarTrackSegment[]
  color: string
}

export const getTracksData = createSelector(
  [selectDataviews, selectTracks],
  (dataviewWorkspaces, tracks) => {
    const tracksSegments: TimebarTrack[] = dataviewWorkspaces
      .filter((dataviewWorkspace: DataviewWorkspace) => {
        return (
          dataviewWorkspace.dataview?.config.type === Type.Track &&
          dataviewWorkspace.dataview?.config.visible !== false
        )
      })
      .map((dataviewWorkspace: DataviewWorkspace) => {
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
      })

    return tracksSegments
  }
)

// TODO: The trackCarrier/trackFishing stuff is completely track-inspector specific, will need to be abstracted for map-client
export const getEventsForTracks = createSelector(
  [selectDataviews, selectEvents, selectTracks],
  (dataviewWorkspaces, events) => {
    const vesselsEvents = dataviewWorkspaces
      .filter((dataviewWorkspace: DataviewWorkspace) => {
        // get Tracks gen configs, not VesselEvents, to ensure events will appear in the same order as tracks
        return (
          dataviewWorkspace.dataview?.config.type === Type.Track &&
          dataviewWorkspace.dataview?.config.visible !== false
        )
      })
      .map((dataviewWorkspace: DataviewWorkspace) => {
        const id = dataviewWorkspace.datasetParams.id
        const vesselEvents = events[id] || []
        return vesselEvents
      })
    return vesselsEvents
  }
)

// Inject colors using type and auth status
export const getEventsWithRenderingInfo = createSelector([getEventsForTracks], (eventsForTrack) => {
  // + add text descriptions
  const eventsWithRenderingInfo = eventsForTrack.map((trackEvents: Event[]) => {
    return trackEvents.map((event: Event) => {
      let colorKey = event.type as string
      if (event.type === 'encounter') {
        colorKey = `${colorKey}${event.encounter?.authorizationStatus}`
      }
      const color = EVENTS_COLORS[colorKey]
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
      return {
        ...event,
        color,
        description,
      }
    })
  })
  return eventsWithRenderingInfo
})
