import type { ApiClient } from './client'

export type PaymentStatus = 'processing' | 'accepted' | 'rejected' | 'cancelled'

export interface StartPaymentRequest {
  transaction_id: string
  amount: number
  player_count: number
}

export interface PaymentResponse {
  transaction_id: string
  status: PaymentStatus
  reason?: 'timeout' | 'user_cancelled'
}

export class PaymentApiService {
  private pending = new Map<string, Promise<PaymentResponse>>()
  constructor(private client: ApiClient) {}

  private validate(response: PaymentResponse, transactionId: string, final: boolean) {
    const statuses = final ? ['accepted', 'rejected', 'cancelled'] : ['processing', 'accepted', 'rejected', 'cancelled']
    if (!response || response.transaction_id !== transactionId || !statuses.includes(response.status)) {
      throw new Error('Unexpected payment response')
    }
    return response
  }

  async startPayment(request: StartPaymentRequest): Promise<PaymentResponse> {
    const existing = this.pending.get(request.transaction_id)
    if (existing) return existing
    // Backend owns the 30-second reader timeout; transport timeout is longer.
    const operation = this.client.post<PaymentResponse>('/payments/initiate', request, { timeout: 60000 })
      .then(({ data }) => this.validate(data, request.transaction_id, true))
      .finally(() => { this.pending.delete(request.transaction_id) })
    this.pending.set(request.transaction_id, operation)
    return operation
  }

  async cancelPayment(transactionId: string): Promise<PaymentResponse> {
    const response = await this.client.post<PaymentResponse>(`/payments/${encodeURIComponent(transactionId)}/cancel`)
    return this.validate(response.data, transactionId, false)
  }
}

export const createPaymentApi = (client: ApiClient) => new PaymentApiService(client)
