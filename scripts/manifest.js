/* eslint-disable */
const favicons = require('favicons')
const path = require('path')
const fs = require('fs')

const iconsPath = 'icons'
const dest = `../public/${iconsPath}`
const source = './public/icon.png'

const dirImages = path.resolve(__dirname, dest)
if (!fs.existsSync(dirImages)) {
  fs.mkdirSync(dirImages)
}

const PUBLIC_URL = '/track-inspector'
const PUBLIC_REACT_APP_URL = '%PUBLIC_URL%'

const configuration = {
  path: `${PUBLIC_URL}/${iconsPath}`,
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

  const html = res.html.map((h) => h.replace(PUBLIC_URL, PUBLIC_REACT_APP_URL))
  fs.writeFile(path.resolve(__dirname, 'head.html'), html.join('\n'), (err) => {
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
