/**
 * API Services Index
 * Central export point for all API services
 */

export {
  ApiClient,
  ApiError,
  ApiResponse,
  RequestOptions,
  ClientConfig,
  createApiClient,
} from './client';

export { SessionApiService, createSessionApi } from './sessionApi';
export type {
  SessionData,
  StartSessionRequest,
  StartSessionResponse,
} from './sessionApi';

export { PaymentApiService, createPaymentApi } from './paymentApi';
export type {
  PaymentMethod,
  CreatePaymentRequest,
  CreatePaymentResponse,
  ConfirmPaymentRequest,
  ConfirmPaymentResponse,
} from './paymentApi';

export { ResultApiService, createResultApi } from './resultApi';
export type {
  BreathalyzerStatus,
  ActivateBreathalyzerRequest,
  ActivateBreathalyzerResponse,
  BreathalyzerStatusResponse,
  SubmitBreathResultRequest,
  SubmitBreathResultResponse,
} from './resultApi';

// Import for API service aggregation
import { ApiClient } from './client';
import { createSessionApi, SessionApiService } from './sessionApi';
import { createPaymentApi, PaymentApiService } from './paymentApi';
import { createResultApi, ResultApiService } from './resultApi';

/**
 * Aggregated API services container
 */
export interface ApiServices {
  client: ApiClient;
  session: SessionApiService;
  payment: PaymentApiService;
  result: ResultApiService;
}

/**
 * Initialize all API services with a single client
 */
export const initializeApiServices = (baseUrl: string): ApiServices => {
  const client = new ApiClient({
    baseUrl,
    timeout: 30000,
    defaultHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  return {
    client,
    session: createSessionApi(client),
    payment: createPaymentApi(client),
    result: createResultApi(client),
  };
};
