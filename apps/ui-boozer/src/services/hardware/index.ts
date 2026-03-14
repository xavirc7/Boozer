/**
 * Hardware Services Index
 * Central export point for hardware abstraction and implementations
 */

export type {
  PaymentStatus,
  BreathTestStatus,
  PaymentResult,
  BreathTestResult,
  BreathProgressEvent,
  IPaymentTerminal,
  IBreathalyzer,
  IHardwareService,
} from './hardware.types';

export { createMockHardwareService, hardwareService } from './hardware.mock';
