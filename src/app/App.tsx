import React, { Fragment } from 'react'
import './App.css'
import Map from '../map/Map'
import TimebarWrapper from '../timebar/TimebarWrapper.container'

function App() {
  return (
    <Fragment>
      <Map />
      <TimebarWrapper />
    </Fragment>
  )
}

export default App
