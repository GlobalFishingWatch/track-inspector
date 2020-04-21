import { createSelector } from 'reselect'
import { connect } from 'react-redux'
import { formatDistance } from 'date-fns'
import { GeneratorConfig } from '@globalfishingwatch/layer-composer'
import TimebarWrapper from './TimebarWrapper'
import { selectStartQuery, selectEndQuery } from '../routes/routes.selectors'
import { updateQueryParams } from '../routes/routes.actions'
import { selectTracks, selectEvents } from '../vessels/vessels.slice'
import { selectGeneratorConfigs } from '../map/map.selectors'
import { setHighlightedTime, disableHighlightedTime, selectHighlightedTime } from './timebar.slice'
import { selectTimebarLoading } from './timebar.selectors'
import { FeatureCollection } from 'geojson'
import { Event } from '../types'
import { EVENTS_COLORS } from '../constants'

const getGeoJSONTracksData = createSelector(
  [selectGeneratorConfigs, selectTracks],
  (generatorConfigs, tracks) => {
    console.log(generatorConfigs)
    const geoJSONTracks: { geojson: FeatureCollection; color: string }[] = []
    Object.keys(tracks).forEach((id) => {
      const config: GeneratorConfig = generatorConfigs.find(
        (config: GeneratorConfig) => config.datasetParamsId === id
      )
      if (config !== undefined && config.visible !== false) {
        // TODO I'm not able to export TrackGeneratorConfig
        geoJSONTracks.push({ geojson: tracks[id], color: (config as any).color })
      }
    })
    return geoJSONTracks
  }
)

// TODO: The trackCarrier/trackFishing stuff is completely track-inspector specific, will need to be abstracted for map-client
const getEventsForTimebar = createSelector(
  [selectGeneratorConfigs, selectEvents, selectTracks],
  (generatorConfigs, events, tracks) => {
    // Retrieve original carrier and fishing vessels ids from generator config
    const trackCarrierConfig = generatorConfigs.find(
      (config: GeneratorConfig) => config.dataviewId === 'trackCarrier'
    )
    const trackFishingConfig = generatorConfigs.find(
      (config: GeneratorConfig) => config.dataviewId === 'trackFishing'
    )
    if (!trackCarrierConfig || !trackFishingConfig) return []

    // Retrieve events using carrier id
    const carrierId = trackCarrierConfig.datasetParamsId
    const trackCarrierEvents = events[carrierId]
    if (!trackCarrierEvents) return []

    // Inject colors using type and auth status
    // + add text descriptions
    const trackCarrierEventsForTimebar = trackCarrierEvents.map((event: Event) => {
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

    // Filter encounters events from the carrier that are matching the fishing vessel id
    const fishingId = trackFishingConfig.datasetParamsId
    const trackFishingEventsForTimebar = trackCarrierEventsForTimebar.filter(
      (event: Event) => event.encounter && event.encounter.vessel.id === fishingId
    )

    const trackEvents = Object.keys(tracks).map((id) => {
      if (id === carrierId) {
        return trackCarrierEventsForTimebar
      } else if (id === fishingId) {
        return trackFishingEventsForTimebar
      }
      return []
    })
    return trackEvents
  }
)

const mapStateToProps = (state: any) => ({
  start: selectStartQuery(state),
  end: selectEndQuery(state),
  tracks: getGeoJSONTracksData(state),
  tracksEvents: getEventsForTimebar(state),
  loading: selectTimebarLoading(state),
  highlightedTime: selectHighlightedTime(state),
})

const mapDispatchToProps = (dispatch: any) => ({
  setTimerange: (start: string, end: string) => {
    dispatch(updateQueryParams({ start, end }))
  },
  setHighlightedTime: (clientX: number, scale: (arg: number) => Date) => {
    if (clientX === null) {
      dispatch(disableHighlightedTime())
      return
    }
    const start = scale(clientX - 10).toISOString()
    const end = scale(clientX + 10).toISOString()
    dispatch(setHighlightedTime({ start, end }))
  },
  panToEvent: (latitude: number, longitude: number) => {
    dispatch(updateQueryParams({ latitude, longitude }))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(TimebarWrapper)
