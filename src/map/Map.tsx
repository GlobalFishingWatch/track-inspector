import React, { Fragment, useMemo } from 'react'
import ReactMapGL, { ScaleControl } from 'react-map-gl'
import { useSelector, useDispatch } from 'react-redux'
import { format } from 'date-fns'
import LayerComposer, { sort } from '@globalfishingwatch/layer-composer'
import useLayerComposer from '@globalfishingwatch/map-components/components/layer-composer-hook'
import { updateQueryParams } from '../routes/routes.actions'
import { selectViewport, selectTimerange } from '../routes/routes.selectors'
import { selectGeneratorConfigWithData } from './map.selectors'
import useViewport, { Viewport } from './useViewport'
import Loader from '../loaders/Loader'
import { selectLoader } from '../loaders/loaders.selectors'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapControls from './MapControls'
import './Map.css'
import styles from './Map.module.css'

const layerComposer = new LayerComposer()
const styleTransformations = [sort]

function Map() {
  const { zoom, latitude, longitude } = useSelector(selectViewport)
  const { start, end } = useSelector(selectTimerange)
  const loading = useSelector(selectLoader('map'))
  const generatorConfigs = useSelector(selectGeneratorConfigWithData)

  const dispatch = useDispatch()

  const formattedTime = useMemo(() => {
    const startFmt = format(new Date(start), 'PPp')
    const endFmt = format(new Date(end), 'PPp')
    return `${startFmt} - ${endFmt}`
  }, [start, end])

  const globalGeneratorConfig = useMemo(
    () => ({
      start,
      end,
      zoom,
      styleTransformations,
    }),
    [start, end, zoom]
  )
  const [style] = useLayerComposer(layerComposer, generatorConfigs, globalGeneratorConfig)

  const [viewport, onViewportChange] = useViewport(
    // TODO this being an anonymous function, will a Map render be triggered with unrelated store changes???
    (viewport: Viewport) => {
      dispatch(updateQueryParams(viewport))
    },
    zoom,
    latitude,
    longitude
  )

  return (
    <Fragment>
      {loading && <Loader />}
      <ReactMapGL
        width="100%"
        height="100%"
        {...viewport}
        onViewportChange={onViewportChange as any}
        mapStyle={style}
        mapOptions={{
          customAttribution: '© Copyright Global Fishing Watch 2019',
        }}
      >
        <div className={styles.info}>
          <div className={styles.scale}>
            {zoom > 3 && <ScaleControl maxWidth={100} unit="nautical" />}
          </div>
          <div>{formattedTime}</div>
        </div>
      </ReactMapGL>
      <MapControls />
    </Fragment>
  )
}

export default Map
