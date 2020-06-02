import React from 'react'

import { ReactComponent as ScreenImage } from 'assets/images/screen-too-small.svg'

import styles from './app.module.css'

function MobileApp() {
  return (
    <div className={styles.mobileContainer}>
      <ScreenImage className={styles.mobileImage} />
      <h1 className={styles.mobileDisclaimer}>
        You'll need a bigger screen <br /> to explore the entire global fishing fleet
      </h1>
    </div>
  )
}

export default MobileApp
