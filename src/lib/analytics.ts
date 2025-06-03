import posthog from "posthog-js";

class AnalyticsService {
  private initialized = false;
  private isBlocked = false;

  init() {
    if (this.initialized) return;

    const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
    const posthogHost =
      import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com";

    if (posthogKey) {
      try {
        posthog.init(posthogKey, {
          api_host: posthogHost,
          capture_pageview: false, // We'll manually capture page views
          session_recording: {
            maskAllInputs: true,
          },
          bootstrap: {
            distinctID: null,
            isIdentifiedID: false,
            featureFlags: {},
          },
          persistence: "localStorage",
          disable_session_recording: true, // Disable session recording by default
          autocapture: false, // Disable autocapture by default
          capture_pageleave: false, // Disable page leave capture
          disable_persistence: false, // Keep persistence enabled
          disable_cookie: false, // Keep cookies enabled
          secure_cookie: true, // Use secure cookies
          loaded: (posthog) => {
            console.log("PostHog analytics initialized");
            // Check if analytics is blocked
            const testEvent = "test_event_" + Date.now();
            posthog.capture(
              testEvent,
              {},
              {
                send_instantly: true,
                callback: () => {
                  console.log("PostHog analytics working normally");
                },
                error_callback: () => {
                  console.warn("PostHog analytics blocked by browser");
                  this.isBlocked = true;
                },
              }
            );
          },
        });
        this.initialized = true;
      } catch (error) {
        console.warn("Failed to initialize PostHog analytics:", error);
        this.isBlocked = true;
      }
    }
  }

  // Helper method to safely capture events
  private safeCapture(event: string, properties?: any) {
    if (!this.initialized || this.isBlocked) return;

    try {
      posthog.capture(event, properties);
    } catch (error) {
      console.warn(`Failed to capture event ${event}:`, error);
    }
  }

  // Track candidate analysis events
  trackCandidateAnalyzed(candidateData: {
    score: number;
    skills: string[];
    mode: "internal" | "external";
    redFlags: number;
  }) {
    this.safeCapture("candidate_analyzed", {
      score: candidateData.score,
      skills_count: candidateData.skills.length,
      top_skills: candidateData.skills.slice(0, 5),
      mode: candidateData.mode,
      red_flags_count: candidateData.redFlags,
      score_category: this.getScoreCategory(candidateData.score),
    });
  }

  // Track resume uploads
  trackResumeUploaded(fileType: string, fileSize: number) {
    this.safeCapture("resume_uploaded", {
      file_type: fileType,
      file_size: fileSize,
      timestamp: new Date().toISOString(),
    });
  }

  // Track interview questions generation
  trackInterviewQuestionsGenerated(
    candidateName: string,
    questionsCount: number,
    skills: string[]
  ) {
    this.safeCapture("interview_questions_generated", {
      candidate_name: candidateName,
      questions_count: questionsCount,
      skills: skills.slice(0, 5),
      timestamp: new Date().toISOString(),
    });
  }

  // Track external talent search
  trackTalentSearch(query: string, resultsCount: number) {
    this.safeCapture("talent_search_performed", {
      query,
      results_count: resultsCount,
      timestamp: new Date().toISOString(),
    });
  }

  // Track candidate contacted (for outreach system)
  trackCandidateContacted(candidateData: {
    name: string;
    score: number;
    skills: string[];
    contactMethod: "email" | "linkedin";
  }) {
    this.safeCapture("candidate_contacted", {
      candidate_score: candidateData.score,
      contact_method: candidateData.contactMethod,
      skills_count: candidateData.skills.length,
      score_category: this.getScoreCategory(candidateData.score),
      timestamp: new Date().toISOString(),
    });
  }

  // Track page views
  trackPageView(path: string) {
    this.safeCapture("$pageview", {
      path,
      timestamp: new Date().toISOString(),
    });
  }

  // Track feature usage
  trackFeatureUsed(feature: string, context?: any) {
    this.safeCapture("feature_used", {
      feature_name: feature,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  // Set user properties
  setUser(userId: string, properties?: any) {
    if (!this.initialized || this.isBlocked) return;

    try {
      posthog.identify(userId, properties);
    } catch (error) {
      console.warn("Failed to identify user:", error);
    }
  }

  private getScoreCategory(score: number): string {
    if (score >= 8.5) return "high";
    if (score >= 7.0) return "medium";
    return "low";
  }

  // Get analytics data for dashboard
  async getAnalyticsData() {
    if (!this.initialized) {
      return this.getMockData();
    }

    try {
      // For a real implementation, you would typically use PostHog's query API
      // For now, we'll combine some real PostHog data with calculated metrics

      // PostHog doesn't provide a direct query API in the browser for security
      // Instead, we'll track events and maintain our own aggregations

      // Return enhanced data structure with real-time capabilities
      return {
        totalCandidates: 0,
        qualifiedCandidates: 0,
        averageScore: 0,
        topSkills: [],
        conversionRate: 0,
        candidatesBySource: {
          "Resume Upload": 0,
          "GitHub Search": 0,
          LinkedIn: 0,
          "Internal Referral": 0,
        },
        scoreDistribution: {
          "High (8.5+)": 0,
          "Medium (7-8.4)": 0,
          "Low (<7)": 0,
        },
        dailyActivity: [],
        realTimeMetrics: {
          candidatesContactedToday: 0,
          interviewQuestionsGenerated: 0,
          resumesAnalyzedToday: 0,
        },
      };
    } catch (error) {
      console.error("Error fetching PostHog analytics:", error);
      return this.getMockData();
    }
  }

  private getMockData() {
    return {
      totalCandidates: 0,
      qualifiedCandidates: 0,
      averageScore: 0,
      topSkills: [],
      conversionRate: 0,
      candidatesBySource: {},
      scoreDistribution: {},
      dailyActivity: [],
    };
  }
}

export const analytics = new AnalyticsService();
