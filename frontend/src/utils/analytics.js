// Google Analytics 4 Tracking Utility

// Initialize GA4
export const initGA = () => {
  const gaId = process.env.REACT_APP_GA_MEASUREMENT_ID;
  
  if (!gaId) {
    console.warn('Google Analytics Measurement ID not found. Add REACT_APP_GA_MEASUREMENT_ID to .env file.');
    return;
  }

  // Load GA4 script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script1);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', gaId, {
    send_page_view: false // We'll send manually for SPA
  });

  console.log('✅ Google Analytics initialized:', gaId);
};

// Track page views
export const trackPageView = (path, title) => {
  if (!window.gtag) return;
  
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title
  });
  
  console.log('📊 GA: Page view -', path);
};

// Track custom events
export const trackEvent = (eventName, eventParams = {}) => {
  if (!window.gtag) return;
  
  window.gtag('event', eventName, eventParams);
  console.log('📊 GA: Event -', eventName, eventParams);
};

// Predefined event trackers
export const analytics = {
  // Authentication events
  trackSignIn: () => {
    trackEvent('login', {
      method: 'Google OAuth'
    });
  },

  trackSignOut: () => {
    trackEvent('logout');
  },

  // Affiliate link clicks
  trackAffiliateClick: (toolName, toolId, price) => {
    trackEvent('affiliate_click', {
      tool_name: toolName,
      tool_id: toolId,
      value: price,
      currency: 'USD'
    });
  },

  // Video interactions
  trackVideoClick: (videoTitle, videoId, platform) => {
    trackEvent('video_click', {
      video_title: videoTitle,
      video_id: videoId,
      platform: platform
    });
  },

  // Learning path interactions
  trackLearningPathView: (pathTitle, pathId) => {
    trackEvent('view_learning_path', {
      path_title: pathTitle,
      path_id: pathId
    });
  },

  trackLearningPathEnroll: (pathTitle, pathId) => {
    trackEvent('enroll_learning_path', {
      path_title: pathTitle,
      path_id: pathId
    });
  },

  // Event registration
  trackEventRegistration: (eventTitle, eventId, eventDate) => {
    trackEvent('event_registration', {
      event_title: eventTitle,
      event_id: eventId,
      event_date: eventDate
    });
  },

  // Build interactions
  trackBuildView: (buildTitle, buildId, builder) => {
    trackEvent('view_build', {
      build_title: buildTitle,
      build_id: buildId,
      builder: builder
    });
  },

  trackBuildLike: (buildTitle, buildId) => {
    trackEvent('like_build', {
      build_title: buildTitle,
      build_id: buildId
    });
  },

  trackBuildCreate: (buildTitle) => {
    trackEvent('create_build', {
      build_title: buildTitle
    });
  },

  // Forum interactions
  trackForumTopicView: (topicTitle, topicId, category) => {
    trackEvent('view_forum_topic', {
      topic_title: topicTitle,
      topic_id: topicId,
      category: category
    });
  },

  trackForumTopicCreate: (topicTitle, category) => {
    trackEvent('create_forum_topic', {
      topic_title: topicTitle,
      category: category
    });
  },

  // Navigation
  trackNavigation: (destination) => {
    trackEvent('navigation', {
      destination: destination
    });
  },

  // CTA clicks
  trackCTA: (ctaName, location) => {
    trackEvent('cta_click', {
      cta_name: ctaName,
      location: location
    });
  },

  // Search
  trackSearch: (searchTerm) => {
    trackEvent('search', {
      search_term: searchTerm
    });
  },

  // Admin actions
  trackAdminAction: (action, itemType) => {
    trackEvent('admin_action', {
      action: action,
      item_type: itemType
    });
  }
};

export default analytics;