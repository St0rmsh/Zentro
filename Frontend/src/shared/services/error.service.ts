/**
 * Error Monitoring Service Wrapper
 * This acts as a facade for future error monitoring tools like Sentry, LogRocket, or OpenTelemetry.
 */

class ErrorService {
  private isInitialized = false;

  init() {
    // Initialize your future provider here
    // e.g., Sentry.init(...)
    this.isInitialized = true;
    console.log('[ErrorMonitor] Initialized');
  }

  captureException(error: Error | unknown, context?: Record<string, any>) {
    if (!this.isInitialized) {
      console.error('[ErrorMonitor] Unhandled Exception:', error, context);
      return;
    }
    
    // Future integration: Sentry.captureException(error, { extra: context })
    console.error(`[ErrorMonitor] Captured Exception:`, error, context);
  }

  captureMessage(message: string, context?: Record<string, any>) {
    if (!this.isInitialized) {
      console.warn('[ErrorMonitor] Message:', message, context);
      return;
    }
    
    // Future integration: Sentry.captureMessage(message)
    console.warn(`[ErrorMonitor] Captured Message: ${message}`, context);
  }

  setUser(userId: string | null) {
    if (!this.isInitialized) return;
    
    // Future integration: Sentry.setUser({ id: userId })
    console.log(`[ErrorMonitor] Set User Context: ${userId}`);
  }
}

export const errorMonitor = new ErrorService();
