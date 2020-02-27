import React, { useState } from 'react';
import ReactMapGL from 'react-map-gl';
import LayerComposer, { sort } from "@globalfishingwatch/layer-composer";
import useLayerComposer from "@globalfishingwatch/map-components/components/layer-composer-hook";
import Timebar from "@globalfishingwatch/map-components/components/timebar";
import './App.css';
import './useViewport'
import useViewport from './useViewport';

const layerComposer = new LayerComposer();
const styleTransformations = [sort];

function Map(props: any) {
  const {
    zoom,
    latitude,
    longitude,
    start,
    end,
    generatorConfigs,
    setMapViewport,
    setTimerange
  } = props

  const [style] = useLayerComposer(
    layerComposer,
    styleTransformations,
    generatorConfigs,
    {
      start,
      end
    }
  );

  const [viewport, onViewportChange] = useViewport(setMapViewport, zoom, latitude, longitude)

  return (
    <>
      <div className="map">
        <ReactMapGL
          width="100%"
          height="100%"
          {...viewport}
          onViewportChange={onViewportChange as any}
          mapStyle={style}
        />
      </div>
      <div className="timebar">
        <Timebar
          enablePlayback
          start={start}
          end={end}
          absoluteStart={"2019-01-01T00:00:00.000Z"}
          absoluteEnd={"2020-01-01T00:00:00.000Z"}
          onChange={(start:string, end: string) => {
            // TODO needs to be debounced like viewport
            setTimerange(start, end)
          }}
        ></Timebar>
      </div>
    </>
  );
}

export default Map;

