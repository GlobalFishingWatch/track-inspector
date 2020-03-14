import { useState, useMemo, useCallback } from 'react'
import debounce from 'lodash/debounce'

const trunc = (v: number) => Math.trunc(v * 100000) / 100000

const useViewport = (
  setMapViewport: (zoom: number, latitude: number, longitude: number) => any,
  zoom: number,
  latitude: number,
  longitude: number
) => {
  const [localViewport, setLocalViewport] = useState<{
    latitude: number
    longitude: number
    zoom: number
  } | null>(null)

  const setViewportDebounced = useCallback(
    debounce((zoom: number, latitude: number, longitude: number) => {
      // Needs to be done in this order to avoid loops
      // First we update the url and then clean the local state
      // because local goes first in priority for center: animationCenter || localCenter || urlCenter,
      setMapViewport(trunc(zoom), trunc(latitude), trunc(longitude))
      setLocalViewport(null)
    }, 400),
    [setMapViewport]
  )

  const onViewportChange = useCallback(
    (viewport) => {
      const { latitude, longitude, zoom } = viewport
      setLocalViewport({ zoom, latitude, longitude })
      setViewportDebounced(zoom, latitude, longitude)
    },
    [setLocalViewport, setViewportDebounced]
  )

  const viewport = useMemo(() => {
    if (localViewport) {
      return localViewport
    }
    return {
      latitude,
      longitude,
      zoom,
    }
  }, [localViewport, latitude, longitude, zoom])

  return [viewport, onViewportChange]
}

export default useViewport
