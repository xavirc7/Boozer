import { ApiClient, ApiResponse } from './client';

/**
 * Session types
 */
export interface SessionData {
  id: string;
  userId: string;
  startTime: string;
  status: 'active' | 'completed' | 'cancelled';
  expiresAt: string;
}

export interface StartSessionRequest {
  testType: string;
  location?: string;
  notes?: string;
}

export interface StartSessionResponse {
  sessionId: string;
  expiresAt: string;
}

/**
 * Session API Service
 * Handles all session-related API operations
 */
class SessionApiService {
  constructor(private client: ApiClient) {}

  /**
   * Start a new drinking and driving detection session
   */
  async startSession(request: StartSessionRequest): Promise<ApiResponse<StartSessionResponse>> {
    // TODO: Replace with real API call once backend is ready
    // return this.client.post<StartSessionResponse>('/sessions', request);

    // Mock implementation with simulated latency
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            sessionId: `session-${Date.now()}`,
            expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
          },
          status: 201,
          headers: {
            'content-type': 'application/json',
          },
        });
      }, 300); // Simulate 300ms latency
    });
  }

  /**
   * Get session details
   */
  async getSession(sessionId: string): Promise<ApiResponse<SessionData>> {
    // TODO: Replace with real API call once backend is ready
    // return this.client.get<SessionData>(`/sessions/${sessionId}`);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id: sessionId,
            userId: 'user-123',
            startTime: new Date().toISOString(),
            status: 'active',
            expiresAt: new Date(Date.now() + 3600000).toISOString(),
          },
          status: 200,
          headers: {
            'content-type': 'application/json',
          },
        });
      }, 200);
    });
  }

  /**
   * End current session
   */
  async endSession(sessionId: string): Promise<ApiResponse<{ success: boolean }>> {
    // TODO: Replace with real API call once backend is ready
    // return this.client.delete<{ success: boolean }>(`/sessions/${sessionId}`);

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
      }, 150);
    });
  }
}

/**
 * Create session API service instance
 */
export const createSessionApi = (client: ApiClient): SessionApiService => {
  return new SessionApiService(client);
};

export default SessionApiService;
