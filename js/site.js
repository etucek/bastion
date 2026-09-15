/*
 * Bastion — navigation, dropdowns, scroll state.
 */
(function () {
  'use strict';

  var body = document.body;

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
    if (panel) panel.classList.toggle('open', expanded);

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
    panel.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  dropdowns.forEach(function(dropdown) {
    var toggle = dropdown.querySelector('[data-dropdown-toggle]');
    if (!toggle) return;
    toggle.addEventListener('click', function(event) {
      event.stopPropagation();
      var panel = dropdown.querySelector('[data-dropdown-panel]');
      setOpen(dropdown, panel && !panel.classList.contains('open'));
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
