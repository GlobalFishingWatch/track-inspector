import { createSelector } from 'reselect'
import { connect } from 'react-redux'
import { GeneratorConfig } from '@globalfishingwatch/layer-composer'
import TimebarWrapper from './TimebarWrapper'
import { getStartQuery, getEndQuery } from './model/route.selectors'
import { updateQueryParams } from './model/router.actions'
import { setHighlightedTime, disableHighlightedTime } from './model/app.actions'
import { FeatureCollection } from 'geojson'
import { Loader, Event } from './types/types'
import { EVENTS_COLORS } from './constants'

const getGeneratorConfigs = (state: any) => state.map.generatorConfigs
const getTracks = (state: any) => state.vessels.tracks
const getEvents = (state: any) => state.vessels.events
const getLoaders = (state: any) => state.loaders.loaders
const getHighlightedTime = (state: any) => state.app.highlightedTime

const getGeoJSONTracksData = createSelector(
  [getGeneratorConfigs, getTracks],
  (generatorConfigs, tracks) => {
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

// TODO: This is completely track-inspector specific, will need to be abstracted for map-client
const getEventsForTimebar = createSelector(
  [getGeneratorConfigs, getEvents, getTracks],
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
    const trackCarrierEventsWithColors = trackCarrierEvents.map((event: Event) => {
      let colorKey = event.type as string
      if (event.type === 'encounter') {
        colorKey = `${colorKey}${event.encounter?.authorizationStatus}`
      }
      const color = EVENTS_COLORS[colorKey]
      return {
        ...event,
        color,
      }
    })

    // Filter encounters events from the carrier that are matching the fishing vessel id
    const fishingId = trackFishingConfig.datasetParamsId
    const trackFishingEventsWithColors = trackCarrierEventsWithColors.filter(
      (event: Event) => event.encounter && event.encounter.vessel.id === fishingId
    )

    console.log(trackFishingEventsWithColors)

    const trackEvents = Object.keys(tracks).map((id) => {
      if (id === carrierId) {
        return trackCarrierEventsWithColors
      } else if (id === fishingId) {
        return trackFishingEventsWithColors
      }
      return []
    })
    return trackEvents
  }
)

const getLoading = createSelector([getLoaders], (loaders: Loader[]): boolean => {
  return loaders.filter((l) => l.areas.includes('timebar')).length > 0
})

const mapStateToProps = (state: any) => ({
  start: getStartQuery(state),
  end: getEndQuery(state),
  tracks: getGeoJSONTracksData(state),
  tracksEvents: getEventsForTimebar(state),
  loading: getLoading(state),
  highlightedTime: getHighlightedTime(state),
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
})

export default connect(mapStateToProps, mapDispatchToProps)(TimebarWrapper)
