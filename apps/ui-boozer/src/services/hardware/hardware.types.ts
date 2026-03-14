/**
 * Hardware abstraction types
 * Interface definitions for payment terminal and breathalyzer devices
 */

/**
 * Payment status states
 */
export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failure';

/**
 * Breath test states
 */
export type BreathTestStatus = 'idle' | 'ready' | 'testing' | 'complete' | 'error';

/**
 * Payment result
 */
export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  errorMessage?: string;
}

/**
 * Breath test result
 */
export interface BreathTestResult {
  bac: number; // Blood Alcohol Content (%)
  timestamp: string;
  isValid: boolean;
}

/**
 * Breath progress event - fired during active breath test
 */
export interface BreathProgressEvent {
  progress: number; // 0-100
  currentBac?: number; // Real-time BAC measurement if available
  status: BreathTestStatus;
}

/**
 * Payment Terminal Interface
 * Abstracts payment hardware like card readers and digital wallets
 */
export interface IPaymentTerminal {
  /**
   * Start a payment transaction
   * Prepares terminal for card/tap input and awaits payment
   */
  startPayment(amount: number, currency: string): Promise<PaymentResult>;

  /**
   * Cancel current payment operation
   * Must be called to gracefully stop waiting for payment
   */
  cancelPayment(): Promise<void>;

  /**
   * Get current status of payment terminal
   */
  getStatus(): PaymentStatus;
}

/**
 * Breathalyzer Interface
 * Abstracts breathalyzer hardware for BAC measurement
 */
export interface IBreathalyzer {
  /**
   * Start a new breath test
   * Prepares device and returns promise that resolves when complete
   */
  startBreathTest(): Promise<BreathTestResult>;

  /**
   * Listen to breath test progress updates
   * Callback fires during active testing to report progress
   */
  listenBreathProgress(callback: (event: BreathProgressEvent) => void): () => void;

  /**
   * Stop active breath test
   * Can cancel an ongoing test session
   */
  stopBreathTest(): Promise<void>;

  /**
   * Get current status of breathalyzer
   */
  getStatus(): BreathTestStatus;
}

/**
 * Hardware Service Container
 * Provides unified access to all hardware devices
 */
export interface IHardwareService {
  paymentTerminal: IPaymentTerminal;
  breathalyzer: IBreathalyzer;
}
