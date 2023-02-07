import allDownloaderApps from './all-downloader-apps'

const data = allDownloaderApps()

process.on('SIGINT', () => {
  data.stopManager()
  data.appInstance.close()
})
