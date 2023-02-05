import app, { reloadConfig } from './app'
import { getServerConfig, serverConfig } from './utils/info'

reloadConfig()
app.listen(getServerConfig().mainPort, () => {
  // eslint-disable-next-line no-console
  console.log(`Main server running on port ${serverConfig.mainPort}`)
})
