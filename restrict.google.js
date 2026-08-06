// restrict-google.js - Blocks all Google tracking across site

(function(){
  // 1. Block gtag / dataLayer pushes
  window.dataLayer = [];
  window.gtag = function(){};
  window.google_trackConversion = function(){};
  window.google_trackRemarketing = function(){};

  // 2. Block GTM
  window.google_tag_manager = {};
  window.GoogleAnalyticsObject = 'ga';
  window.ga = function(){};

  // 3. Override script loading to block google domains
  const blockedDomains = [
    'googletagmanager.com',
    'google-analytics.com', 
    'googleadservices.com',
    'doubleclick.net',
    'google.com/ads',
    'googlesyndication.com'
  ];

  // Intercept new script tags
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName) {
    const el = originalCreateElement.apply(this, arguments);
    if(tagName.toLowerCase() === 'script'){
      const originalSetAttribute = el.setAttribute;
      el.setAttribute = function(attr, value){
        if(attr === 'src' && blockedDomains.some(d => value.includes(d))){
          console.warn('Blocked Google Script:', value);
          return; // don't set src
        }
        return originalSetAttribute.apply(this, arguments);
      }
    }
    return el;
  }

  // 4. Block existing google scripts already in DOM
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('script[src*="google"]').forEach(s => s.remove());
    document.querySelectorAll('iframe[src*="googletagmanager"]').forEach(s => s.remove());
  });

  console.log('%c Google Tracking Disabled', 'color: #00E676; font-weight: bold');
})();
