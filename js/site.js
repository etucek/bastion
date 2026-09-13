/*
 * Bastion — navigation, dropdowns, scroll state.
 */
(function () {
  'use strict';

  var body = document.body;

  // Mark nav items that have children so CSS can draw a caret
  document.querySelectorAll('.dropmenu li').forEach(function (li) {
    if (li.querySelector(':scope > ul')) li.classList.add('has-children');
  });

  // Keep dropdown panels inside the viewport. Panels are laid out even while
  // hidden, so their position can be measured up front and re-checked on
  // resize; nothing runs while the visitor is hovering. querySelectorAll
  // returns document order, so a parent panel is flipped before the nested
  // panels hanging off it are measured.
  var EDGE_GAP = 8;
  var panels = document.querySelectorAll('.dropmenu li > ul');

  function fitPanels() {
    if (!panels.length) return;
    var vw = document.documentElement.clientWidth;
    panels.forEach(function (ul) { ul.parentNode.classList.remove('flip-x'); });
    panels.forEach(function (ul) {
      var li = ul.parentNode;
      var rtl = getComputedStyle(ul).direction === 'rtl';
      var rect = ul.getBoundingClientRect();
      if (!(rtl ? rect.left < EDGE_GAP : rect.right > vw - EDGE_GAP)) return;
      li.classList.add('flip-x');
      // Never trade one clipped edge for the other. On a wrapped nav the last
      // item can sit at the far start, where flipping would push it off the
      // opposite side.
      var flipped = ul.getBoundingClientRect();
      if (rtl ? flipped.right > vw - EDGE_GAP : flipped.left < EDGE_GAP) {
        li.classList.remove('flip-x');
      }
    });
  }

  var fitTimer;
  window.addEventListener('resize', function () {
    clearTimeout(fitTimer);
    fitTimer = setTimeout(fitPanels, 100);
  });
  fitPanels();
  // Web fonts can land after first paint and change the panel widths
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitPanels);

  // Click-to-open on touch devices (hover is flaky on iOS)
  var isTouch = matchMedia('(hover: none)').matches;
  if (isTouch) {
    document.querySelectorAll('.dropmenu li.has-children > a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var li = a.parentNode;
        if (!li.classList.contains('open')) {
          e.preventDefault();
          document.querySelectorAll('.dropmenu li.open').forEach(function (other) {
            if (other !== li && !other.contains(li)) other.classList.remove('open');
          });
          li.classList.add('open');
        }
      });
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.dropmenu')) {
        document.querySelectorAll('.dropmenu li.open').forEach(function (li) { li.classList.remove('open'); });
      }
    });
  }

  // Mobile menu toggle - header hamburger doubles as the close button, its
  // icon morphs bars <-> xmark in place, plus backdrop click.
  var toggle = document.getElementById('toggle');
  var overlay = document.getElementById('overlay');
  function setMobileNavOpen(open) {
    if (!toggle || !overlay) return;
    overlay.classList.toggle('open', open);
    document.documentElement.classList.toggle('overflow-hidden', open);
    var label = open ? toggle.dataset.labelClose : toggle.dataset.labelOpen;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (label) toggle.setAttribute('aria-label', label);
    toggle.querySelectorAll('[data-mobile-nav-icon]').forEach(function (icon) {
      icon.classList.toggle('hidden', (icon.dataset.mobileNavIcon === 'open') !== open);
    });
    var textLabel = toggle.querySelector('[data-mobile-nav-label]');
    if (textLabel && label) textLabel.textContent = label;
  }
  function closeMobileMenu() {
    setMobileNavOpen(false);
  }
  if (toggle && overlay) {
    toggle.addEventListener('click', function () {
      setMobileNavOpen(!overlay.classList.contains('open'));
    });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.tagName === 'A') {
        closeMobileMenu();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeMobileMenu();
    });
  }

  // Collapsible submenus in the nav panel (accordion: click to expand/collapse)
  document.addEventListener('click', function (event) {
    var menuToggle = event.target.closest('[data-menu-toggle]');
    if (!menuToggle) return;

    var item = menuToggle.closest('[data-menu-item]');
    if (!item) return;

    var expanded = item.dataset.expanded !== 'true';
    item.dataset.expanded = expanded ? 'true' : 'false';

    var panel = item.querySelector(':scope > [data-menu-panel]');
    if (panel) panel.classList.toggle('hidden', !expanded);

    var iconOpen = menuToggle.querySelector('[data-menu-icon-open]');
    var iconClosed = menuToggle.querySelector('[data-menu-icon-closed]');
    if (iconOpen) iconOpen.classList.toggle('hidden', !expanded);
    if (iconClosed) iconClosed.classList.toggle('hidden', expanded);
  });

  // Search overlay toggle
  var searchOverlay = document.getElementById('search-overlay');
  if (searchOverlay) {
    var openSearch = function () {
      closeMobileMenu();
      searchOverlay.classList.add('open');
      document.documentElement.classList.add('overflow-hidden');
      var field = searchOverlay.querySelector('input[name="searchfield"]');
      if (field) field.focus();
    };
    var closeSearch = function () {
      searchOverlay.classList.remove('open');
      document.documentElement.classList.remove('overflow-hidden');
    };
    document.querySelectorAll('[data-search-toggle="open"]').forEach(function (btn) {
      btn.addEventListener('click', openSearch);
    });
    searchOverlay.addEventListener('click', function (e) {
      if (e.target === searchOverlay || e.target.closest('[data-search-toggle="close"]')) {
        closeSearch();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && searchOverlay.classList.contains('open')) closeSearch();
    });
  }

  // Background parallax for hero sections tagged `.parallax`.
  // Vanilla port of Quark 1's parallaxBackground(); rAF-throttled and
  // disabled when the visitor prefers reduced motion. Driven off the same
  // scroll listener as the scroll-state below so there's only one handler.
  var parallaxNodes = document.querySelectorAll('.hero.parallax');
  var parallaxOn = parallaxNodes.length && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  var parallaxTicking = false;
  function applyParallax() {
    var offset = window.scrollY * 0.3;
    parallaxNodes.forEach(function (el) {
      el.style.backgroundPositionY = offset + 'px';
    });
    parallaxTicking = false;
  }

  // Scroll state (for sticky header shadow + animated shrink)
  // Hysteresis: the navbar shrinks by 12px when `.scrolled` is on, which
  // shifts layout and can flip scrollY back over a single threshold. The
  // 16px dead zone between ON_AT and OFF_AT is wider than that delta so a
  // toggle-induced layout shift can never re-cross the opposite threshold.
  var SCROLL_ON_AT = 20;
  var SCROLL_OFF_AT = 4;
  var lastScrolled = false;
  function onScroll() {
    var y = window.scrollY;
    var scrolled = lastScrolled ? y > SCROLL_OFF_AT : y > SCROLL_ON_AT;
    if (scrolled !== lastScrolled) {
      body.classList.toggle('scrolled', scrolled);
      lastScrolled = scrolled;
    }
    if (parallaxOn && !parallaxTicking) {
      window.requestAnimationFrame(applyParallax);
      parallaxTicking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Smooth-scroll to #start for "angle-down" hero chevron
  var toStart = document.getElementById('to-start');
  if (toStart) {
    toStart.addEventListener('click', function () {
      var target = document.getElementById('start');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
})();

// Generic small dropdown (button + panel) - currently just the header
// language switcher, but built to be reusable for any future one.
(function() {
  var dropdowns = document.querySelectorAll('[data-dropdown]');
  if (!dropdowns.length) return;

  function setOpen(dropdown, open) {
    var toggle = dropdown.querySelector('[data-dropdown-toggle]');
    var panel = dropdown.querySelector('[data-dropdown-panel]');
    if (!toggle || !panel) return;
    panel.classList.toggle('hidden', !open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  dropdowns.forEach(function(dropdown) {
    var toggle = dropdown.querySelector('[data-dropdown-toggle]');
    if (!toggle) return;
    toggle.addEventListener('click', function(event) {
      event.stopPropagation();
      var panel = dropdown.querySelector('[data-dropdown-panel]');
      setOpen(dropdown, panel && panel.classList.contains('hidden'));
    });
  });

  document.addEventListener('click', function(event) {
    dropdowns.forEach(function(dropdown) {
      if (!dropdown.contains(event.target)) setOpen(dropdown, false);
    });
  });

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      dropdowns.forEach(function(dropdown) { setOpen(dropdown, false); });
    }
  });
})();
