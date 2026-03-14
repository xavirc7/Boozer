import { ApiClient, ApiResponse } from './client';

/**
 * Result types
 */
export interface BreathTestData {
  sessionId: string;
  bac: number; // Blood Alcohol Content (%)
  measurement: string; // Raw measurement value
  timestamp: string;
}

export interface SubmitBreathTestRequest {
  sessionId: string;
  bac: number;
  measurement: string;
  deviceId?: string;
  notes?: string;
}

export interface SubmitBreathTestResponse {
  testId: string;
  sessionId: string;
  bac: number;
  status: 'valid' | 'invalid' | 'processing';
  processedAt: string;
}

export interface TestResult {
  resultId: string;
  sessionId: string;
  testId: string;
  bac: number;
  status: 'safe' | 'warning' | 'fail' | 'error';
  interpretation: string;
  recommendations: string[];
  timestamp: string;
  expiresAt: string;
}

export interface ResultQueryParams {
  sessionId?: string;
  resultId?: string;
  testId?: string;
}

/**
 * Result API Service
 * Handles all breath test results and analytics
 */
class ResultApiService {
  constructor(private client: ApiClient) {}

  /**
   * Submit a breath test measurement
   */
  async submitBreathTest(
    request: SubmitBreathTestRequest
  ): Promise<ApiResponse<SubmitBreathTestResponse>> {
    // TODO: Replace with real API call once backend is ready
    // return this.client.post<SubmitBreathTestResponse>('/tests/breath', request);

    // Mock implementation with simulated latency
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            testId: `test-${Date.now()}`,
            sessionId: request.sessionId,
            bac: request.bac,
            status: 'valid',
            processedAt: new Date().toISOString(),
          },
          status: 201,
          headers: {
            'content-type': 'application/json',
          },
        });
      }, 500); // Simulate 500ms latency for test processing
    });
  }

  /**
   * Get test result
   */
  async getResult(resultId: string): Promise<ApiResponse<TestResult>> {
    // TODO: Replace with real API call once backend is ready
    // return this.client.get<TestResult>(`/results/${resultId}`);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate realistic BAC levels
        const bac = parseFloat((Math.random() * 0.15).toFixed(3)); // 0-0.15%
        let status: 'safe' | 'warning' | 'fail' | 'error';
        let interpretation: string;
        let recommendations: string[];

        if (bac < 0.02) {
          status = 'safe';
          interpretation = 'Below legal limit - Safe to drive';
          recommendations = ['You are safe to drive', 'Enjoy responsibly'];
        } else if (bac < 0.05) {
          status = 'warning';
          interpretation = 'Approaching legal limit - Use caution';
          recommendations = [
            'Consider using alternative transportation',
            'Avoid driving if possible',
          ];
        } else if (bac < 0.08) {
          status = 'fail';
          interpretation = 'AT or OVER legal limit - Do NOT drive';
          recommendations = [
            'DO NOT drive - You are impaired',
            'Call a taxi or rideshare',
            'Use designated driver',
            'Contact local authorities if needed',
          ];
        } else {
          status = 'fail';
          interpretation = 'SIGNIFICANTLY OVER legal limit - Serious impairment';
          recommendations = [
            'CRITICAL: DO NOT drive',
            'Seek immediate safe transportation',
            'Contact emergency services if experiencing symptoms',
          ];
        }

        resolve({
          data: {
            resultId,
            sessionId: 'session-123',
            testId: `test-${Date.now()}`,
            bac,
            status,
            interpretation,
            recommendations,
            timestamp: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour expiry
          },
          status: 200,
          headers: {
            'content-type': 'application/json',
          },
        });
      }, 300);
    });
  }

  /**
   * Get multiple results for a session
   */
  async getResultsBySession(sessionId: string): Promise<ApiResponse<TestResult[]>> {
    // TODO: Replace with real API call once backend is ready
    // return this.client.get<TestResult[]>(`/sessions/${sessionId}/results`);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            {
              resultId: `result-${Date.now()}`,
              sessionId,
              testId: `test-${Date.now()}`,
              bac: 0.045,
              status: 'warning',
              interpretation: 'Approaching legal limit - Use caution',
              recommendations: [
                'Consider using alternative transportation',
                'Avoid driving if possible',
              ],
              timestamp: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 3600000).toISOString(),
            },
          ],
          status: 200,
          headers: {
            'content-type': 'application/json',
          },
        });
      }, 250);
    });
  }

  /**
   * Get health/analytics summary for a period
   */
  async getAnalytics(params?: {
    days?: number;
    sessionId?: string;
  }): Promise<ApiResponse<{ totalTests: number; averageBac: number; testDates: string[] }>> {
    // TODO: Replace with real API call once backend is ready
    // return this.client.get<any>('/analytics', { params });

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            totalTests: Math.floor(Math.random() * 20) + 1,
            averageBac: parseFloat((Math.random() * 0.08).toFixed(3)),
            testDates: Array.from({ length: 5 }, (_, i) =>
              new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
            ),
          },
          status: 200,
          headers: {
            'content-type': 'application/json',
          },
        });
      }, 350);
    });
  }
}

/**
 * Create result API service instance
 */
export const createResultApi = (client: ApiClient): ResultApiService => {
  return new ResultApiService(client);
};

export default ResultApiService;
