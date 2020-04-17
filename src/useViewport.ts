import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import debounce from 'lodash/debounce'

type Viewport = {
  latitude: number
  longitude: number
  zoom: number
}

const trunc = (v: number) => Math.trunc(v * 100000) / 100000

const usePrevious = (value: any): Viewport => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current || { latitude: 0, longitude: 0, zoom: 0 }
}

const useViewport = (
  setMapViewport: (zoom: number, latitude: number, longitude: number) => any,
  zoom: number,
  latitude: number,
  longitude: number
) => {
  const [localViewport, setLocalViewport] = useState<Viewport | null>(null)

  const prevViewport = usePrevious({ latitude, longitude, zoom })

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
      setViewportDebounced(zoom, latitude, longitude)
    },
    [setLocalViewport, setViewportDebounced]
  )

  return [viewport, onViewportChange]
}

export default useViewport
