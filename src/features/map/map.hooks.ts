import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import debounce from 'lodash/debounce'
import { MiniglobeBounds } from '@globalfishingwatch/ui-components/dist/miniglobe'
import { selectViewport } from 'routes/routes.selectors'
import { updateQueryParams } from 'routes/routes.actions'
import { selectEditing } from 'features/rulers/rulers.selectors'
import { editRuler, moveCurrentRuler } from 'features/rulers/rulers.slice'
import { LatLon } from 'types'

export interface Viewport extends LatLon {
  latitude: number
  longitude: number
  zoom: number
}

export const useViewportConnect = () => {
  const dispatch = useDispatch()
  const { zoom, latitude, longitude } = useSelector(selectViewport)
  const dispatchViewport = (newViewport: Partial<Viewport>) =>
    dispatch(updateQueryParams(newViewport))
  return { zoom, latitude, longitude, dispatchViewport }
}

export const useMapClick = () => {
  const dispatch = useDispatch()
  const rulersEditing = useSelector(selectEditing)
  return useCallback(
    (event) => {
      if (rulersEditing === true) {
        dispatch(
          editRuler({
            longitude: event.lngLat[0],
            latitude: event.lngLat[1],
          })
        )
        return
      }
    },
    [dispatch, rulersEditing]
  )
}

export const useMapMove = () => {
  const dispatch = useDispatch()
  const rulersEditing = useSelector(selectEditing)
  const [hoverCenter, setHoverCenter] = useState<LatLon | null>(null)
  const onMapMove = useCallback(
    (event) => {
      const center = {
        longitude: event.lngLat[0],
        latitude: event.lngLat[1],
      }
      setHoverCenter(center)
      if (rulersEditing === true) {
        dispatch(moveCurrentRuler(center))
      }
    },
    [dispatch, rulersEditing]
  )
  return { onMapMove, hoverCenter }
}

export const useMapBounds = (mapRef: any) => {
  const { zoom, latitude, longitude } = useViewportConnect()
  const [bounds, setBounds] = useState<MiniglobeBounds | any>(null)
  useEffect(() => {
    const mapboxRef = mapRef.current && mapRef.current.getMap()
    if (mapboxRef) {
      const rawBounds = mapboxRef.getBounds()
      if (rawBounds) {
        setBounds({
          north: rawBounds.getNorth() as number,
          south: rawBounds.getSouth() as number,
          west: rawBounds.getWest() as number,
          east: rawBounds.getEast() as number,
        })
      }
    }
  }, [zoom, latitude, longitude, mapRef])
  return bounds
}

// ------

const trunc = (v: number) => Math.trunc(v * 100000) / 100000

const usePrevious = (value: any): Viewport => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current || { latitude: 0, longitude: 0, zoom: 0 }
}

export const useViewport = (
  setMapViewport: ({ zoom, latitude, longitude }: Viewport) => any,
  zoom: number,
  latitude: number,
  longitude: number
) => {
  const [localViewport, setLocalViewport] = useState<Viewport | null>(null)

  const prevViewport = usePrevious({ latitude, longitude, zoom })

  const debounceRef: any = useRef(null)

  const setViewportDebounced = useCallback(
    (viewport: Viewport) => {
      if (debounceRef.current) {
        debounceRef.current.cancel()
      }
      debounceRef.current = debounce(() => {
        // Needs to be done in this order to avoid loops
        // First we update the url and then clean the local state
        // because local goes first in priority for center: animationCenter || localCenter || urlCenter,
        setMapViewport({
          zoom: trunc(viewport.zoom),
          latitude: trunc(viewport.latitude),
          longitude: trunc(viewport.longitude),
        })
        setLocalViewport(null)
      }, 400)
      debounceRef.current()
    },
    [setMapViewport]
  )

  const viewport = useMemo(() => {
    let transitionDuration = 0
    if (Math.abs(latitude - prevViewport.latitude) > 0 || Math.abs(zoom - prevViewport.zoom) > 0) {
      transitionDuration = 500
    }
    if (localViewport) {
      return localViewport
    }
    return {
      latitude,
      longitude,
      zoom,
      transitionDuration,
    }
  }, [localViewport, latitude, longitude, zoom, prevViewport])

  const onViewportChange = useCallback(
    (newViewport) => {
      const { latitude, longitude, zoom } = newViewport
      setLocalViewport({ zoom, latitude, longitude })
      setViewportDebounced({ zoom, latitude, longitude })
    },
    [setLocalViewport, setViewportDebounced]
  )

  return [viewport, onViewportChange]
}
