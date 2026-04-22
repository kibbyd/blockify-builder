/**
 * JS Generation - Script generation for interactive elements
 *
 * Generates JavaScript for tabs, countdown, slideshow, and entrance animations
 */

/**
 * Generate JS for a single element
 */
export const generateElementJS = (element) => {
  if (!element || !element.type) return '';

  let js = '';

  switch (element.type) {
    case 'tabs': {
      const elId = element.id;
      js += `
  // Tabs: ${elId}
  (function() {
    var container = document.querySelector('[data-element-id="${elId}"]');
    if (!container) return;
    var buttons = container.querySelectorAll('.tabs__button');
    var panels = container.querySelectorAll('.tabs__panel');
    buttons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var tab = btn.getAttribute('data-tab');
        buttons.forEach(function(b) { b.classList.remove('active'); });
        panels.forEach(function(p) { p.classList.remove('active'); });
        btn.classList.add('active');
        var panel = container.querySelector('[data-tab-panel="' + tab + '"]');
        if (panel) panel.classList.add('active');
      });
    });
  })();
`;
      break;
    }

    case 'countdown': {
      const elId = element.id;
      js += `
  // Countdown: ${elId}
  (function() {
    var container = document.querySelector('[data-element-id="${elId}"]');
    if (!container) return;
    var target = container.getAttribute('data-countdown-target');
    var expiredMsg = container.getAttribute('data-countdown-expired') || 'Expired';
    var targetDate = new Date(target).getTime();
    function update() {
      var now = new Date().getTime();
      var diff = targetDate - now;
      if (diff <= 0) {
        container.innerHTML = '<div class="countdown__expired">' + expiredMsg + '</div>';
        return;
      }
      var days = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var minutes = Math.floor((diff % 3600000) / 60000);
      var seconds = Math.floor((diff % 60000) / 1000);
      var daysEl = container.querySelector('[data-countdown-days]');
      var hoursEl = container.querySelector('[data-countdown-hours]');
      var minutesEl = container.querySelector('[data-countdown-minutes]');
      var secondsEl = container.querySelector('[data-countdown-seconds]');
      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }
    update();
    setInterval(update, 1000);
  })();
`;
      break;
    }

    case 'slideshow': {
      const elId = element.id;
      const autoplay = element.props?.autoplay !== false;
      const interval = (element.props?.autoplayInterval || 5) * 1000;
      js += `
  // Slideshow: ${elId}
  (function() {
    var container = document.querySelector('[data-element-id="${elId}"]');
    if (!container) return;
    var slides = container.querySelectorAll('.slideshow__slide');
    var dots = container.querySelectorAll('.slideshow__dot');
    var prevBtn = container.querySelector('[data-slide-prev]');
    var nextBtn = container.querySelector('[data-slide-next]');
    var current = 0;
    var total = slides.length;
    if (total === 0) return;
    function goTo(index) {
      slides.forEach(function(s) { s.classList.remove('active'); });
      dots.forEach(function(d) { d.classList.remove('active'); });
      current = ((index % total) + total) % total;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }
    if (prevBtn) prevBtn.addEventListener('click', function() { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function() { goTo(current + 1); });
    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function() { goTo(i); });
    });
    ${autoplay ? `setInterval(function() { goTo(current + 1); }, ${interval});` : ''}
  })();
`;
      break;
    }

    case 'popup': {
      const elId = element.id;
      const popupId = elId.replace(/[^a-zA-Z0-9]/g, '_');
      js += `
  // Popup: ${elId}
  (function() {
    var wrapper = document.querySelector('[data-element-id="${elId}"]');
    if (!wrapper) return;
    var trigger = wrapper.querySelector('.popup-trigger');
    var overlay = document.getElementById('popup-${popupId}');
    var closeBtn = overlay ? overlay.querySelector('.popup-close') : null;
    if (trigger && overlay) {
      trigger.addEventListener('click', function() { overlay.style.display = 'flex'; });
      overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.style.display = 'none'; });
    }
    if (closeBtn && overlay) {
      closeBtn.addEventListener('click', function() { overlay.style.display = 'none'; });
    }
    var form = wrapper.querySelector('.popup-email-form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        var formData = new FormData(form);
        var submitBtn = form.querySelector('.popup-submit');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }
        fetch('/contact', {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' },
          redirect: 'manual'
        }).then(function() {
          var successMsg = wrapper.querySelector('.popup-success');
          form.style.display = 'none';
          if (successMsg) successMsg.style.display = 'block';
        }).catch(function() {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Try Again'; }
        });
      });
    }
  })();
`;
      break;
    }

    case 'before-after': {
      const elId = element.id;
      js += `
  // Before/After Slider: ${elId}
  (function() {
    var container = document.querySelector('[data-element-id="${elId}"]');
    if (!container) return;
    var before = container.querySelector('.ba-before');
    var handle = container.querySelector('.ba-handle');
    var inner = container.querySelector('.ba-before-inner');
    if (!before || !handle || !inner) return;
    function sizeInner() {
      inner.style.width = container.offsetWidth + 'px';
    }
    var startPos = parseFloat(container.getAttribute('data-start-position')) || 50;
    before.style.width = startPos + '%';
    handle.style.left = startPos + '%';
    sizeInner();
    window.addEventListener('resize', sizeInner);
    var dragging = false;
    function getPos(e) {
      var rect = container.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      return Math.min(100, Math.max(0, (x / rect.width) * 100));
    }
    function onMove(e) {
      if (!dragging) return;
      e.preventDefault();
      var pos = getPos(e);
      before.style.width = pos + '%';
      handle.style.left = pos + '%';
    }
    function onEnd() {
      dragging = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
    }
    function onStart(e) {
      e.preventDefault();
      dragging = true;
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onEnd);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onEnd);
    }
    handle.addEventListener('mousedown', onStart);
    handle.addEventListener('touchstart', onStart, { passive: false });
    container.addEventListener('mousedown', function(e) {
      if (e.target === handle || handle.contains(e.target)) return;
      var pos = getPos(e);
      before.style.width = pos + '%';
      handle.style.left = pos + '%';
      onStart(e);
    });
  })();
`;
      break;
    }

    default:
      break;
  }

  return js;
};

/**
 * Generate JS for all elements recursively
 */
export const generateAllElementsJS = (elements) => {
  let js = '';

  const processElement = (element) => {
    js += generateElementJS(element);

    if (element.children && element.children.length > 0) {
      element.children.forEach(child => processElement(child));
    }

    if (element.columns && element.columns.length > 0) {
      element.columns.forEach(column => {
        if (column && Array.isArray(column)) {
          column.forEach(child => processElement(child));
        }
      });
    }
  };

  elements.forEach(element => processElement(element));
  return js;
};

/**
 * Generate entrance animation JS (IntersectionObserver)
 */
export const generateEntranceAnimationJS = (elements) => {
  // Check if any element uses entrance animations
  let hasAnimations = false;

  const checkElement = (element) => {
    const anim = element.style?.entranceAnimation;
    if (anim && anim !== 'none') {
      hasAnimations = true;
      return;
    }
    if (element.children) element.children.forEach(checkElement);
    if (element.columns) element.columns.forEach(col => {
      if (Array.isArray(col)) col.forEach(checkElement);
    });
  };
  elements.forEach(checkElement);

  if (!hasAnimations) return '';

  return `
  // Entrance Animations (IntersectionObserver)
  (function() {
    var targets = document.querySelectorAll('[data-entrance]');
    if (!targets.length) return;
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    targets.forEach(function(el) { observer.observe(el); });
  })();
`;
};

/**
 * Generate complete Liquid scripts block
 */
export const generateLiquidScripts = (elements) => {
  let scripts = '';

  const elementJS = generateAllElementsJS(elements);
  const animationJS = generateEntranceAnimationJS(elements);

  const allJS = elementJS + animationJS;

  if (allJS.trim()) {
    scripts += `<script>\n  document.addEventListener('DOMContentLoaded', function() {\n${allJS}\n  });\n</script>\n`;
  }

  return scripts;
};
