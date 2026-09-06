import { ApiClient } from './client'
import { createPaymentApi } from './paymentApi'
import { createResultApi } from './resultApi'
import { createMockApiServices } from './api.mock'

export { ApiClient, createApiClient } from './client'
export type { ApiError, ApiResponse, RequestOptions, ClientConfig } from './client'
export { PaymentApiService, createPaymentApi } from './paymentApi'
export type { PaymentStatus, PaymentResponse, StartPaymentRequest } from './paymentApi'
export { ResultApiService, createResultApi } from './resultApi'
export type { BreathResult } from './resultApi'

export const initializeApiServices = (baseUrl: string) => {
  const client = new ApiClient({ baseUrl })
  return { payment: createPaymentApi(client), result: createResultApi(client) }
}

// Both Vite and Nginx proxy /api to the local device backend.
// Opt in only once the backend implements the contract in this folder's README.
export const apiServices = import.meta.env.VITE_API_MODE === 'real'
  ? initializeApiServices('/api')
  : createMockApiServices()
