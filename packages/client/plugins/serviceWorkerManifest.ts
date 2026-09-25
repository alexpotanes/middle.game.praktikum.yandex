import fs from 'fs'
import path from 'path'
import type { Plugin } from 'vite'

interface ServiceWorkerManifestPluginOptions {
  manifestPath: string
}

const PRECACHE_ASSET_EXTENSIONS = new Set([
  '.css',
  '.gif',
  '.html',
  '.ico',
  '.jpeg',
  '.jpg',
  '.js',
  '.png',
  '.svg',
  '.webp',
  '.woff',
  '.woff2',
])

function getBuildAssetUrls(fileNames: string[]) {
  return fileNames
    .filter(fileName => fileName !== 'sw.js')
    .filter(fileName => fileName !== 'precache-manifest.js')
    .filter(fileName => !fileName.endsWith('.map'))
    .filter(
      fileName => fileName === 'index.html' || fileName.startsWith('assets/')
    )
    .filter(fileName => PRECACHE_ASSET_EXTENSIONS.has(path.extname(fileName)))
    .map(fileName => `/${fileName}`)
}

function getDistFileNames(manifestPath: string) {
  const outDir = path.dirname(manifestPath)

  if (!fs.existsSync(outDir)) {
    return []
  }

  const fileNames: string[] = []

  function collectFileNames(directory: string) {
    fs.readdirSync(directory, { withFileTypes: true }).forEach(entry => {
      const fullPath = path.join(directory, entry.name)

      if (entry.isDirectory()) {
        collectFileNames(fullPath)
        return
      }

      fileNames.push(path.relative(outDir, fullPath).split(path.sep).join('/'))
    })
  }

  collectFileNames(outDir)

  return fileNames
}

export function serviceWorkerManifestPlugin({
  manifestPath,
}: ServiceWorkerManifestPluginOptions): Plugin {
  let buildAssetUrls: string[] = []
  const manifestUrl = `/${path.basename(manifestPath)}`

  return {
    name: 'service-worker-manifest',
    enforce: 'post',
    generateBundle(_options, bundle) {
      if (!bundle['index.html']) {
        return
      }

      buildAssetUrls = getBuildAssetUrls(Object.keys(bundle))
    },
    closeBundle() {
      const assetUrls =
        buildAssetUrls.length > 0
          ? buildAssetUrls
          : getBuildAssetUrls(getDistFileNames(manifestPath))

      if (assetUrls.length === 0) {
        return
      }

      const precacheUrls = [...new Set([manifestUrl, ...assetUrls])]

      const manifest = `self.__PRECACHE_MANIFEST__ = ${JSON.stringify(precacheUrls)}\n`

      fs.writeFileSync(manifestPath, manifest)
    },
  }
}
