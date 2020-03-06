/* eslint-disable */
const favicons = require('favicons')
const path = require('path')
const fs = require('fs')

const dest = '../public/icons'
const source = './public/icon.png'

const dirImages = path.resolve(__dirname, dest)
if (!fs.existsSync(dirImages)) {
  fs.mkdirSync(dirImages)
}

const configuration = {
  path: '%PUBLIC_URL%/icons',
  appName: 'Track Inspector',
  appDescription: null,
  developerName: null,
  developerURL: null,
  dir: 'auto',
  lang: 'en-US',
  background: '#fff',
  theme_color: '#163f89',
  display: 'standalone',
  orientation: 'any',
  start_url: '/',
  version: '1.0',
  logging: true,
  icons: {
    android: true,
    appleIcon: true,
    appleStartup: true,
    coast: false,
    favicons: true,
    firefox: false,
    windows: true,
    yandex: false,
  },
}

const callback = function(err, res) {
  if (err) {
    console.log(err.message)
    return
  }

  fs.writeFile(path.resolve(__dirname, 'head.html'), res.html.join('\n'), (err) => {
    if (err) {
      console.log(err)
    }
  })

  res.images.forEach((image) => {
    fs.writeFile(path.resolve(__dirname, dest, image.name), image.contents, (err) => {
      if (err) {
        console.log(err)
      }
    })
  })

  res.files.forEach((file) => {
    fs.writeFile(path.resolve(__dirname, dest, file.name), file.contents, (err) => {
      if (err) {
        console.log(err)
      }
    })
  })
}

favicons(source, configuration, callback)
