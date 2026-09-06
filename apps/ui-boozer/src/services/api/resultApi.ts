import type { ApiClient } from './client'

export interface BreathResult {
  test_id: string
  transaction_id: string
  player_index: number
  status: 'completed'
  bac_level: number
  unit: 'g/l'
}

export class ResultApiService {
  constructor(private client: ApiClient) {}

  async listenBreathalyzer(transactionId: string, playerIndex: number): Promise<BreathResult> {
    const response = await this.client.post<BreathResult>('/hardware/alcoholimeter/start', {
      transaction_id: transactionId,
      player_index: playerIndex,
    }, { timeout: 60000 })
    const result = response.data
    if (!result || result.transaction_id !== transactionId || result.player_index !== playerIndex || result.status !== 'completed' || result.unit !== 'g/l' || !Number.isFinite(result.bac_level) || result.bac_level < 0) {
      throw new Error('Invalid final reading')
    }
    return result
  }
}

export const createResultApi = (client: ApiClient) => new ResultApiService(client)
