import { ApiClient, ApiResponse } from './client';

/**
 * Simplified breathalyzer flow types.
 * This models the actual device lifecycle we care about:
 * power on -> ready to blow -> measuring -> stop -> final BAC value
 */

export type BreathalyzerStatus =
  | 'offline'
  | 'warming_up'
  | 'ready'
  | 'listening'
  | 'enough_sample'
  | 'completed'
  | 'error';

export interface ActivateBreathalyzerRequest {
  sessionId: string;
  deviceId?: string;
}

export interface ActivateBreathalyzerResponse {
  testId: string;
  status: 'warming_up' | 'ready';
  message: string;
  readyToBlow: boolean;
}

export interface BreathalyzerStatusResponse {
  testId: string;
  status: BreathalyzerStatus;
  message: string;
  readyToBlow: boolean;
  shouldStopBlowing: boolean;
}

export interface SubmitBreathResultRequest {
  testId: string;
  bac: number;
}

export interface SubmitBreathResultResponse {
  testId: string;
  status: 'completed';
  bac: number;
  measuredAt: string;
}

/**
 * Result API Service
 * Focused only on the breathalyzer device flow and final BAC value.
 */
class ResultApiService {
  constructor(private client: ApiClient) {
    void this.client;
  }

  /**
   * Notify backend/controller to power on the breathalyzer.
   * For now it resolves with a mock "ready" response.
   */
  async activateBreathalyzer(
    request: ActivateBreathalyzerRequest
  ): Promise<ApiResponse<ActivateBreathalyzerResponse>> {
    void request;

    // TODO: Replace with real API call once backend is ready
    // return this.client.post<ActivateBreathalyzerResponse>('/breathalyzer/activate', request);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            testId: `test-${Date.now()}`,
            status: 'ready',
            message: 'Breathalyzer ready. Start blowing.',
            readyToBlow: true,
          },
          status: 200,
          headers: {
            'content-type': 'application/json',
          },
        });
      }, 500);
    });
  }

  /**
   * Poll the current device state.
   * This is the place to expose "keep blowing" / "stop blowing" states.
   */
  async getBreathalyzerStatus(
    testId: string
  ): Promise<ApiResponse<BreathalyzerStatusResponse>> {
    // TODO: Replace with real API call once backend is ready
    // return this.client.get<BreathalyzerStatusResponse>(`/breathalyzer/tests/${testId}/status`);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            testId,
            status: 'enough_sample',
            message: 'Enough sample collected. Stop blowing.',
            readyToBlow: false,
            shouldStopBlowing: true,
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
   * Send the final BAC value measured by the sensor/controller.
   * We only persist/return the numeric result because that is all we need.
   */
  async submitBreathResult(
    request: SubmitBreathResultRequest
  ): Promise<ApiResponse<SubmitBreathResultResponse>> {
    // TODO: Replace with real API call once backend is ready
    // return this.client.post<SubmitBreathResultResponse>('/breathalyzer/results', request);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            testId: request.testId,
            status: 'completed',
            bac: request.bac,
            measuredAt: new Date().toISOString(),
          },
          status: 201,
          headers: {
            'content-type': 'application/json',
          },
        });
      }, 300);
    });
  }
}

export const createResultApi = (client: ApiClient): ResultApiService => {
  return new ResultApiService(client);
};

export default ResultApiService;
