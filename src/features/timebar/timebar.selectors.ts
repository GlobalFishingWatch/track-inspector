import { createSelector } from '@reduxjs/toolkit'
import { formatDistance } from 'date-fns'
import { selectDataviews } from 'features/dataviews/dataviews.slice'
import { selectTracks, selectEvents } from 'features/vessels/vessels.slice'
import { Event } from 'types'
import { EVENTS_COLORS } from 'config'
import { DataviewWorkspace } from '@globalfishingwatch/api-client'

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
    const tracksSegments: TimebarTrack[] = []
    Object.keys(tracks).forEach((id) => {
      const dataviewWorkspace = dataviewWorkspaces.find(
        (dataviewWorkspace: DataviewWorkspace) => id === dataviewWorkspace.datasetParams.id
      )
      if (!dataviewWorkspace || !dataviewWorkspace.dataview) return
      const config = dataviewWorkspace.dataview.config
      if (config.visible !== false) {
        const trackSegments: TimebarTrackSegment[] = tracks[id].map((segment) => {
          return {
            start: segment[0].timestamp || 0,
            end: segment[segment.length - 1].timestamp || 0,
          }
        })
        tracksSegments.push({
          segments: trackSegments,
          color: config.color,
        })
      }
    })
    return tracksSegments
  }
)

// TODO: The trackCarrier/trackFishing stuff is completely track-inspector specific, will need to be abstracted for map-client
export const getEventsForTracks = createSelector(
  [selectDataviews, selectEvents, selectTracks],
  (dataviewWorkspaces, events, tracks) => {
    // Retrieve original carrier and fishing vessels ids from generator config
    const trackCarrierDataviewWorkspace = dataviewWorkspaces.find(
      (dataviewWorkspace: DataviewWorkspace) =>
        dataviewWorkspace.dataview && dataviewWorkspace.dataview.id === 'trackCarrier'
    )
    const trackFishingDataviewWorkspace = dataviewWorkspaces.find(
      (dataviewWorkspace: DataviewWorkspace) =>
        dataviewWorkspace.dataview && dataviewWorkspace.dataview.id === 'trackFishing'
    )
    if (!trackCarrierDataviewWorkspace || !trackFishingDataviewWorkspace) return []

    // Retrieve events using carrier id
    const carrierId = trackCarrierDataviewWorkspace.datasetParams.id
    const trackCarrierEvents = events[carrierId]
    if (!trackCarrierEvents) return []

    // Filter encounters events from the carrier that are matching the fishing vessel id
    const fishingId = trackFishingDataviewWorkspace.datasetParams.id
    const trackFishingEventsForTimebar = trackCarrierEvents.filter(
      (event: Event) => event.encounter && event.encounter.vessel.id === fishingId
    )

    const trackEvents = Object.keys(tracks).map((id) => {
      if (id === carrierId) {
        return trackCarrierEvents
      } else if (id === fishingId) {
        return trackFishingEventsForTimebar
      }
      return []
    })
    return trackEvents
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
