import { createSelector } from 'reselect'
import { connect } from 'react-redux'
import { GeneratorConfig } from '@globalfishingwatch/layer-composer'
import TimebarWrapper from './TimebarWrapper'
import { getStartQuery, getEndQuery } from './model/route.selectors'
import { updateQueryParams } from './model/router.actions'
import { FeatureCollection } from 'geojson'
import { Loader } from './types/types'

const getGeneratorConfigs = (state: any) => state.map.generatorConfigs
const getTracks = (state: any) => state.vessels.tracks
const getLoaders = (state: any) => state.loaders.loaders

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

const getLoading = createSelector([getLoaders], (loaders: Loader[]): boolean => {
  return loaders.filter((l) => l.areas.includes('timebar')).length > 0
})

const mapStateToProps = (state: any) => ({
  start: getStartQuery(state),
  end: getEndQuery(state),
  tracks: getGeoJSONTracksData(state),
  loading: getLoading(state),
})

const mapDispatchToProps = (dispatch: any) => ({
  setTimerange: (start: string, end: string) => {
    dispatch(updateQueryParams({ start, end }))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(TimebarWrapper)
