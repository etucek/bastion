/*
 * Bastion — appearance controller
 *
 * Order of precedence: user preference (localStorage) > theme-mode default >
 * OS preference. When the user picks "auto", we listen for OS changes and
 * swap data-theme live.
 *
 * The inline bootstrap in base.html.twig sets data-theme before first paint
 * to eliminate FOUC. This file handles the runtime toggling UI: a 3-way
 * segmented control (light/auto/dark) rather than a single cycling button.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'bastion-theme';
  var root = document.documentElement;
  var ORDER = ['light', 'auto', 'dark'];

  function getStored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function setStored(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
  }
  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyMode(mode) {
    var resolved = (mode === 'light' || mode === 'dark')
      ? mode
      : (systemPrefersDark() ? 'dark' : 'light');
    root.setAttribute('data-theme', resolved);
    root.setAttribute('data-theme-preference', mode === 'light' || mode === 'dark' ? mode : 'auto');
    root.classList.toggle('dark', resolved === 'dark');
  }

  function currentPreference() {
    return getStored() || root.getAttribute('data-theme-default') || 'auto';
  }

  function updateGroup(group, pref) {
    var index = ORDER.indexOf(pref);
    if (index === -1) index = 1;
    var indicator = group.querySelector('[data-theme-indicator]');
    if (indicator) indicator.style.transform = 'translateX(' + (index * 100) + '%)';
    group.querySelectorAll('[data-mode-option]').forEach(function (btn) {
      btn.setAttribute('aria-checked', btn.getAttribute('data-mode-option') === pref ? 'true' : 'false');
    });
  }

  // React to OS changes when in auto mode
  if (window.matchMedia) {
    var mql = window.matchMedia('(prefers-color-scheme: dark)');
    var handler = function () {
      if (currentPreference() === 'auto') applyMode('auto');
    };
    if (mql.addEventListener) mql.addEventListener('change', handler);
    else if (mql.addListener) mql.addListener(handler);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var groups = document.querySelectorAll('[data-theme-toggle]');
    var pref = currentPreference();
    applyMode(pref);
    groups.forEach(function (group) {
      updateGroup(group, pref);
      group.querySelectorAll('[data-mode-option]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var next = btn.getAttribute('data-mode-option');
          setStored(next);
          applyMode(next);
          groups.forEach(function (g) { updateGroup(g, next); });
        });
      });
    });
  });
})();
