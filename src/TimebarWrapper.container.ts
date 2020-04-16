import { createSelector } from 'reselect'
import { connect } from 'react-redux'
import { GeneratorConfig } from '@globalfishingwatch/layer-composer'
import TimebarWrapper from './TimebarWrapper'
import { getStartQuery, getEndQuery } from './model/route.selectors'
import { updateQueryParams } from './model/router.actions'
import { setHighlightedTime, disableHighlightedTime } from './model/app.actions'
import { FeatureCollection } from 'geojson'
import { Loader } from './types/types'

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
        (config: GeneratorConfig) => config.id === id
      )
      if (config !== undefined && config.visible !== false) {
        // TODO I'm not able to export TrackGeneratorConfig
        geoJSONTracks.push({ geojson: tracks[id], color: (config as any).color })
      }
    })
    return geoJSONTracks
  }
)

const getEventsForTimebar = createSelector([getEvents, getTracks], (events, tracks) => {
  const carrierEvents = Object.keys(tracks).map((id) => {
    if (id === 'trackCarrier') {
      return events.carrierEvents || []
    }
    return []
  })
  return carrierEvents
})

const getLoading = createSelector([getLoaders], (loaders: Loader[]): boolean => {
  return loaders.filter((l) => l.areas.includes('timebar')).length > 0
})

const mapStateToProps = (state: any) => ({
  start: getStartQuery(state),
  end: getEndQuery(state),
  tracks: getGeoJSONTracksData(state),
  events: getEventsForTimebar(state),
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
