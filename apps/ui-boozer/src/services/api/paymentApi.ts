import { ApiClient, ApiResponse } from './client';

/**
 * Payment types
 */
export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'digital_wallet';
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface CreatePaymentRequest {
  sessionId: string;
  amount: number;
  currency: string;
  description?: string;
  paymentMethod?: PaymentMethod;
}

export interface CreatePaymentResponse {
  paymentId: string;
  sessionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  clientSecret?: string; // For payment processing
  createdAt: string;
}

export interface ConfirmPaymentRequest {
  paymentId: string;
  paymentMethod: PaymentMethod;
  billingDetails?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export interface ConfirmPaymentResponse {
  paymentId: string;
  status: 'completed' | 'failed' | 'pending';
  transactionId?: string;
  errorMessage?: string;
  completedAt?: string;
}

/**
 * Payment API Service
 * Handles all payment-related API operations
 */
class PaymentApiService {
  constructor(private client: ApiClient) {}

  /**
   * Create a new payment
   */
  async createPayment(request: CreatePaymentRequest): Promise<ApiResponse<CreatePaymentResponse>> {
    // TODO: Replace with real API call once backend is ready
    // return this.client.post<CreatePaymentResponse>('/payments', request);

    // Mock implementation with simulated latency
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            paymentId: `pay-${Date.now()}`,
            sessionId: request.sessionId,
            amount: request.amount,
            currency: request.currency,
            status: 'pending',
            clientSecret: `client-secret-${Date.now()}`, // For Stripe/payment processor
            createdAt: new Date().toISOString(),
          },
          status: 201,
          headers: {
            'content-type': 'application/json',
          },
        });
      }, 400); // Simulate 400ms latency
    });
  }

  /**
   * Confirm and process a payment
   */
  async confirmPayment(
    request: ConfirmPaymentRequest
  ): Promise<ApiResponse<ConfirmPaymentResponse>> {
    // TODO: Replace with real API call once backend is ready
    // return this.client.post<ConfirmPaymentResponse>(`/payments/${request.paymentId}/confirm`, request);

    // Mock implementation with simulated latency
    return new Promise((resolve) => {
      setTimeout(() => {
        const isSuccessful = Math.random() > 0.1; // 90% success rate for demo

        resolve({
          data: {
            paymentId: request.paymentId,
            status: isSuccessful ? 'completed' : 'failed',
            transactionId: isSuccessful ? `txn-${Date.now()}` : undefined,
            errorMessage: isSuccessful ? undefined : 'Card declined',
            completedAt: isSuccessful ? new Date().toISOString() : undefined,
          },
          status: isSuccessful ? 200 : 402, // 402 Payment Required for failed
          headers: {
            'content-type': 'application/json',
          },
        });
      }, 800); // Simulate 800ms latency for payment processing
    });
  }

  /**
   * Get payment details
   */
  async getPayment(paymentId: string): Promise<ApiResponse<CreatePaymentResponse>> {
    // TODO: Replace with real API call once backend is ready
    // return this.client.get<CreatePaymentResponse>(`/payments/${paymentId}`);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            paymentId,
            sessionId: 'session-123',
            amount: 25.99,
            currency: 'USD',
            status: 'completed',
            createdAt: new Date(Date.now() - 60000).toISOString(),
          },
          status: 200,
          headers: {
            'content-type': 'application/json',
          },
        });
      }, 250);
    });
  }

  /**
   * Cancel a payment
   */
  async cancelPayment(paymentId: string): Promise<ApiResponse<{ success: boolean }>> {
    // TODO: Replace with real API call once backend is ready
    // return this.client.delete<{ success: boolean }>(`/payments/${paymentId}`);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: { success: true },
          status: 200,
          headers: {
            'content-type': 'application/json',
          },
        });
      }, 200);
    });
  }
}

/**
 * Create payment API service instance
 */
export const createPaymentApi = (client: ApiClient): PaymentApiService => {
  return new PaymentApiService(client);
};

export default PaymentApiService;
