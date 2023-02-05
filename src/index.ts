import { SearchClient } from './client'

export { SearchClient }

declare global {
  interface Window {
    wiki: {
      SearchClient: typeof import('./client').SearchClient
    }
  }
}
