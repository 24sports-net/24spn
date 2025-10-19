/* script.js — SAFE replacement
   Replaces the previous obfuscated script. No eval(), no Function(), no external network calls.
   Put this file in place of the obfuscated script.js.
*/
(function(){
  'use strict';

  // List suspicious domains (extend if you see others)
  var blockedDomains = [
    'widespreadcomponent.com',
    'animatedjumpydisappointing.com'
  ];

  try {
    // Remove any <script> tags that reference blocked domains (best-effort).
    var scripts = document.getElementsByTagName('script');
    var snap = Array.prototype.slice.call(scripts, 0);
    snap.forEach(function(s){
      try {
        var src = s.getAttribute && s.getAttribute('src') || '';
        if (!src) return;
        for (var i = 0; i < blockedDomains.length; i++) {
          if (src.indexOf(blockedDomains[i]) !== -1) {
            s.parentNode && s.parentNode.removeChild(s);
            console.warn('Removed blocked script:', src);
            break;
          }
        }
      } catch(e) { /* ignore per-script errors */ }
    });
  } catch(e) {
    console.error('Script cleanup error:', e);
  }

  // Provide harmless NBQ stub in case other scripts call NBQ(...)
  if (typeof window.NBQ === 'undefined') {
    window.NBQ = function() {
      console.warn('NBQ called — original obfuscated script removed. No-op executed.');
      return function(){ /* no-op */ };
    };
  }

  // Provide a safe gWd decoder stub so any calls like gWd('...') return the original string.
  if (typeof window.gWd === 'undefined') {
    window.gWd = function(s){ return s; };
  }

  // Remove tiny/hidden iframes and iframes from blocked domains
  try {
    var iframes = document.getElementsByTagName('iframe');
    for (var j = iframes.length - 1; j >= 0; j--) {
      try {
        var f = iframes[j];
        var src = f.getAttribute && f.getAttribute('src') || '';
        var w = f.offsetWidth || f.width || 0;
        var h = f.offsetHeight || f.height || 0;
        var remove = false;
        if (src) {
          for (var k = 0; k < blockedDomains.length; k++) {
            if (src.indexOf(blockedDomains[k]) !== -1) { remove = true; break; }
          }
        }
        if ((w === 0 && h === 0) || remove) {
          f.parentNode && f.parentNode.removeChild(f);
          console.warn('Removed suspicious iframe', src || f);
        }
      } catch(e) { /* ignore per-iframe errors */ }
    }
  } catch(e) { /* ignore */ }

  console.info('Safe script.js loaded. Suspicious obfuscated script removed/replaced.');
})();
