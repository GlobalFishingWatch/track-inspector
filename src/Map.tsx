import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactMapGL from 'react-map-gl';
import LayerComposer, {
  sort,
  TYPES
} from "@globalfishingwatch/layer-composer";
import useLayerComposer from "@globalfishingwatch/map-components/components/layer-composer-hook";
import Timebar from "@globalfishingwatch/map-components/components/timebar";
import './App.css';

const layerComposer = new LayerComposer();
const styleTransformations = [sort];

function Map() {

  const dispatch = useDispatch()
  const viewport = useSelector((state: any) => {
    const q = state.location.query || { zoom: 3, latitude: 1, longitude: 1 }
    return {
      zoom: parseFloat(q.zoom),
      latitude: parseFloat(q.latitude),
      longitude: parseFloat(q.longitude),
    }
  })

  const styleConfig = useMemo(() => {
    let config = [
      {
        id: "background",
        type: TYPES.BACKGROUND,
      },
      {
        type: TYPES.BASEMAP,
        id: "landmass"
      }
    ]
    return config
  }, [])

  const [style] = useLayerComposer(
    layerComposer,
    styleTransformations,
    styleConfig
  );

  const [dates, setDates] = useState({
    start: "2019-09-01T00:00:00.000Z",
    end: "2019-10-01T00:00:00.000Z"
  });

  return (
    <>
      <div className="map">
        <ReactMapGL
          width="100%"
          height="100%"
          {...viewport}
          onViewportChange={(vp) => {
            const { latitude, longitude, zoom } = vp
            // TODO should not update ALL query params, use custom middleware as in CP
            dispatch({
              type: 'HOME',
              query: {
                zoom, latitude, longitude
              }
            })
          }}
          mapStyle={style}
        />
      </div>
      <div className="timebar">
        <Timebar
          enablePlayback
          start={dates.start}
          end={dates.end}
          absoluteStart={"2019-01-01T00:00:00.000Z"}
          absoluteEnd={"2020-01-01T00:00:00.000Z"}
          onChange={(start:string, end: string) => {
            setDates({
              start,
              end
            });
          }}
        ></Timebar>
      </div>
    </>
  );
}

export default Map;

