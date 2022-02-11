import React, { Fragment, useRef, useMemo, useState, useCallback } from 'react'
import ReactMapGL from 'react-map-gl'
import { useSelector } from 'react-redux'
import { useWorkspace, useDataviews, useLayerComposer } from '@globalfishingwatch/react-hooks'
import { WorkspaceDataview } from '@globalfishingwatch/dataviews-client'
import { Generators, sort } from '@globalfishingwatch/layer-composer'
import { StyleTransformation } from '@globalfishingwatch/layer-composer/dist/types'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectDataviews } from 'features/dataviews/dataviews.slice'
import { selectDataviewsQuery } from 'routes/routes.selectors'
import { selectResources } from 'features/dataviews/resources.slice'
import { selectRulers } from 'features/rulers/rulers.selectors'
import { EVENTS_COLORS } from 'config'
import { useViewport, useViewportConnect, useMapClick, useMapMove, useMapBounds } from './map.hooks'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapInfo from './MapInfo'
import MapControls from './MapControls'
import './Map.css'

const customColors = (style: any) => {
  const pointColor = [
    'case',
    ['==', ['get', 'authorizationStatus'], 'pending'],
    EVENTS_COLORS.encounterpending,
    ['get', 'color'],
  ]
  const layers = style.layers.map((layer: any) => {
    if (
      (layer.id?.startsWith('eventsCarrier') || layer.id?.startsWith('eventsFishing')) &&
      layer.id?.endsWith('background')
    ) {
      return {
        ...layer,
        paint: {
          ...(layer.paint ?? {}),
          // 'circle-color': ['get', 'color'],
          'circle-color': pointColor,
        },
      }
    }
    return layer
  })

  return sort({ ...style, layers })
}

const styleTransformations: StyleTransformation[] = [customColors]

const Map = () => {
  const { zoom, latitude, longitude, dispatchViewport } = useViewportConnect()
  const { start, end } = useTimerangeConnect()
  const [loaded, setLoaded] = useState(false)

  const dataviews = useWorkspace(
    useSelector(selectDataviews),
    useSelector(selectDataviewsQuery) as WorkspaceDataview[]
  )
  const generatorConfigs = useDataviews(dataviews, useSelector(selectResources))
  const rulers = useSelector(selectRulers)

  const generatorConfigsWithRulers = useMemo(() => {
    const rulersConfig: Generators.RulersGeneratorConfig = {
      type: Generators.Type.Rulers,
      id: 'rulers',
      data: rulers,
    }
    return [...generatorConfigs, rulersConfig]
  }, [generatorConfigs, rulers])

  const globalGeneratorConfig = useMemo(
    () => ({
      start,
      end,
      zoom,
    }),
    [start, end, zoom]
  )
  const { style } = useLayerComposer(
    generatorConfigsWithRulers,
    globalGeneratorConfig,
    styleTransformations
  )

  const [viewport, onViewportChange] = useViewport(
    // TODO this being an anonymous function, will a Map render be triggered with unrelated store changes???
    dispatchViewport,
    zoom,
    latitude,
    longitude
  )

  const mapRef = useRef<any>(null)
  const onMapClick = useMapClick()
  const { onMapMove, hoverCenter } = useMapMove()

  const mapBounds = useMapBounds(loaded ? mapRef : null)
  const onLoadCallback = useCallback(() => {
    setLoaded(true)
  }, [])

  return (
    <Fragment>
      {style && (
        <ReactMapGL
          ref={mapRef}
          width="100%"
          height="100%"
          {...viewport}
          onLoad={onLoadCallback}
          onViewportChange={onViewportChange as any}
          mapStyle={style}
          mapOptions={{
            customAttribution: '© Copyright Global Fishing Watch 2020',
          }}
          onClick={onMapClick}
          onMouseMove={onMapMove}
        >
          <MapInfo center={hoverCenter} />
        </ReactMapGL>
      )}
      <MapControls bounds={mapBounds} />
    </Fragment>
  )
}

export default Map
