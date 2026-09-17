/**
 * Analytics Service Wrapper
 * This acts as a facade for future analytics providers like PostHog, Mixpanel, or Google Analytics.
 */

export interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

class AnalyticsService {
  private isInitialized = false;

  init() {
    // Initialize your future provider here
    // e.g., posthog.init(...)
    this.isInitialized = true;
    console.log('[Analytics] Initialized');
  }

  trackEvent(eventName: string, properties?: EventProperties) {
    if (!this.isInitialized) return;
    
    // Future integration: posthog.capture(eventName, properties)
    console.log(`[Analytics] Track Event: ${eventName}`, properties);
  }

  trackPageView(pageUrl: string) {
    if (!this.isInitialized) return;
    
    // Future integration: trigger page view tracking
    console.log(`[Analytics] Page View: ${pageUrl}`);
  }

  identifyUser(userId: string, traits?: EventProperties) {
    if (!this.isInitialized) return;
    
    // Future integration: posthog.identify(userId, traits)
    console.log(`[Analytics] Identify User: ${userId}`, traits);
  }

  reset() {
    if (!this.isInitialized) return;
    
    // Future integration: clear user context on logout
    console.log('[Analytics] Reset/Logout');
  }
}

export const analytics = new AnalyticsService();
