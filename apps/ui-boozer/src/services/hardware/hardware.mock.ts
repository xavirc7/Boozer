/**
 * Hardware Mock Implementation
 * Simulates payment terminal and breathalyzer devices
 */

import {
  IPaymentTerminal,
  IBreathalyzer,
  IHardwareService,
  PaymentStatus,
  BreathTestStatus,
  PaymentResult,
  BreathTestResult,
  BreathProgressEvent,
} from './hardware.types';

/**
 * Mock Payment Terminal Implementation
 */
class MockPaymentTerminal implements IPaymentTerminal {
  private status: PaymentStatus = 'idle';
  private paymentTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private paymentAbortController: AbortController | null = null;

  async startPayment(amount: number, currency: string): Promise<PaymentResult> {
    void amount;
    void currency;

    this.status = 'processing';
    this.paymentAbortController = new AbortController();

    return new Promise((resolve) => {
      const delay = 2000 + Math.random() * 1000;

      this.paymentTimeoutId = setTimeout(() => {
        if (this.paymentAbortController?.signal.aborted) {
          this.status = 'idle';
          resolve({
            success: false,
            errorMessage: 'Payment cancelled.',
          });
          return;
        }

        const isSuccess = Math.random() > 0.1;

        if (isSuccess) {
          this.status = 'success';
          resolve({
            success: true,
            transactionId: `TXN-${Date.now()}`,
          });
        } else {
          this.status = 'failure';
          resolve({
            success: false,
            errorMessage: 'Card declined. Please try another payment method.',
          });
        }
      }, delay);
    });
  }

  async cancelPayment(): Promise<void> {
    if (this.paymentTimeoutId) {
      clearTimeout(this.paymentTimeoutId);
      this.paymentTimeoutId = null;
    }
    if (this.paymentAbortController) {
      this.paymentAbortController.abort();
      this.paymentAbortController = null;
    }
    this.status = 'idle';
  }

  getStatus(): PaymentStatus {
    return this.status;
  }
}

/**
 * Mock Breathalyzer Implementation
 */
class MockBreathalyzer implements IBreathalyzer {
  private status: BreathTestStatus = 'idle';
  private progressCallback: ((event: BreathProgressEvent) => void) | null = null;
  private testAbortController: AbortController | null = null;

  async startBreathTest(): Promise<BreathTestResult> {
    this.status = 'ready';
    this.testAbortController = new AbortController();

    return new Promise((resolve) => {
      this.status = 'testing';

      const startTime = Date.now();
      const testDuration = 3000; // 3 seconds of simulated blowing
      const updateInterval = 100; // Update every 100ms

      const interval = setInterval(() => {
        if (this.testAbortController?.signal.aborted) {
          clearInterval(interval);
          this.status = 'idle';
          resolve({
            bac: 0,
            timestamp: new Date().toISOString(),
            isValid: false,
          });
          return;
        }

        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / testDuration) * 100, 100);

        // Simulate increasing BAC reading as breath test progresses
        const currentBac = (progress / 100) * (Math.random() * 0.15);

        // Fire progress callback
        if (this.progressCallback) {
          this.progressCallback({
            progress,
            currentBac,
            status: 'testing',
          });
        }

        // Test complete
        if (elapsed >= testDuration) {
          clearInterval(interval);
          this.status = 'complete';

          const finalBac = Math.random() * 0.15; // Final BAC between 0-0.15%

          // Fire final progress event
          if (this.progressCallback) {
            this.progressCallback({
              progress: 100,
              currentBac: finalBac,
              status: 'complete',
            });
          }

          resolve({
            bac: finalBac,
            timestamp: new Date().toISOString(),
            isValid: true,
          });

          this.status = 'idle';
        }
      }, updateInterval);
    });
  }

  listenBreathProgress(callback: (event: BreathProgressEvent) => void): () => void {
    this.progressCallback = callback;

    // Return unsubscribe function
    return () => {
      this.progressCallback = null;
    };
  }

  async stopBreathTest(): Promise<void> {
    if (this.testAbortController) {
      this.testAbortController.abort();
    }
    this.status = 'idle';
    this.progressCallback = null;
  }

  getStatus(): BreathTestStatus {
    return this.status;
  }
}

/**
 * Mock Hardware Service
 * Factory function to create mock hardware service
 */
export const createMockHardwareService = (): IHardwareService => {
  return {
    paymentTerminal: new MockPaymentTerminal(),
    breathalyzer: new MockBreathalyzer(),
  };
};

/**
 * Export service instances (can be replaced with real implementations later)
 */
export const hardwareService = createMockHardwareService();
