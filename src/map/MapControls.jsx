import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateQueryParams } from '../routes/routes.actions'
import { selectViewport } from '../routes/routes.selectors'
import styles from './MapControls.module.css'
import { ReactComponent as IconPlus } from '../assets/icons/plus.svg'
import { ReactComponent as IconMinus } from '../assets/icons/minus.svg'
import { ReactComponent as IconRuler } from '../assets/icons/ruler.svg'

const MapControls = () => {
  const { zoom } = useSelector(selectViewport)
  const dispatch = useDispatch()
  return (
    <div className={styles.mapControls}>
      <button
        className={styles.mapControl}
        onClick={() => {
          dispatch(updateQueryParams({ zoom: zoom + 1 }))
        }}
        aria-label="Increase zoom"
      >
        <IconPlus />
      </button>
      <button
        className={styles.mapControl}
        onClick={() => {
          dispatch(updateQueryParams({ zoom: zoom - 1 }))
        }}
        aria-label="Decrease zoom"
      >
        <IconMinus />
      </button>
      <button
        className={styles.mapControl}
        onClick={() => {
          // dispatch(updateQueryParams({ zoom: zoom - 1 }))
        }}
        aria-label="Decrease zoom"
      >
        <IconRuler />
      </button>
    </div>
  )
}

export default MapControls
