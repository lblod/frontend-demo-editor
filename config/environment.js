'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'frontend-gelinkt-notuleren',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },
    APP: {
      '@lblod/ember-rdfa-editor-date-plugin': {
        allowedInputDateFormats: ['DD/MM/YYYY', 'DD-MM-YYYY',  'DD.MM.YYYY'],
        outputDateFormat: 'D MMMM YYYY'
      },
      analytics: {
        appDomain: "{{ANALYTICS_APP_DOMAIN}}",
        plausibleScript: "{{ANALYTICS_PLAUSIBLE_SCRIPT}}"
      }
    },
    featureFlags: {
      'language-select': false,
      'editor-html-paste': true,
      'editor-extended-html-paste': true
    },
    browserUpdate: {
      vs: {f:-3,c:-3},
      style: 'corner',
      l: 'nl',
      shift_page_down: false
    },
    moment: {
      outputFormat: 'DD-MM-YYYY hh:mm:ss',
      includeTimezone: 'subset',
      includeLocales: ['nl'],
      allowEmpty: true
    },
    torii: {
      disableRedirectInitializer: true,
      providers: {
        'acmidm-oauth2': {
          apiKey: "{{OAUTH_API_KEY}}",
          baseUrl: "{{OAUTH_BASE_URL}}",
          scope: 'openid rrn vo profile abb_gelinktNotuleren',
          redirectUri: "{{OAUTH_REDIRECT_URL}}",
          logoutUrl: "{{OAUTH_LOGOUT_URL}}"
        }
      }
    },
    environmentName: "{{ENVIRONMENT_NAME}}",
    publication: {
      baseUrl: "{{PUBLICATION_BASE_URL}}"
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // Production build specific configuration
  }

  return ENV;
};
