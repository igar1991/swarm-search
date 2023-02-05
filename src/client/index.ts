import axios from 'axios'
import { PublicServerInformation } from '../shared/interfaces'
import { IndexStatusResponse } from '../shared/response/interfaces'
import { SuggestQuery, SuggestResponse } from '../server/interfaces'

export class SearchClient {
  // base URL of the server
  private readonly baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  /**
   * Method for generating the full URL for a given endpoint
   */
  private generateUrl(endpoint: string): string {
    return `${this.baseURL}/${endpoint}`
  }

  /**
   * Getting the server information
   */
  async getServerInfo(): Promise<PublicServerInformation> {
    const response = await axios.get(this.generateUrl('info'))

    return response.data
  }

  /**
   * Getting the status of a specific index
   */
  async getIndexStatus(id: string): Promise<IndexStatusResponse> {
    const response = await axios.get(this.generateUrl('index/status'), {
      params: {
        id,
      },
    })

    return response.data
  }

  /**
   * Ask server to download a specific db
   */
  async useIndex(id: string): Promise<IndexStatusResponse> {
    const response = await axios.post(this.generateUrl('index/use'), {
      id,
    })

    return response.data
  }

  /**
   * Get suggestions
   */
  async suggest(id: string, query: string): Promise<SuggestResponse> {
    const params: SuggestQuery = { id, q: query }
    const response = await axios.get(this.generateUrl('suggest'), {
      params,
    })

    return response.data
  }
}
