# v0.1.12
## 09/13/2026

1. [](#new)
   * Restored a proper lightbox for gallery photos - vendored GLightbox
     (MIT, unrelated to Typhoon) directly into this theme rather than
     depending on the bastion-gallery plugin. Clicking a photo now opens
     a real overlay with left/right navigation and a close button instead
     of just opening the raw image file in a new tab.

# v0.1.11
## 09/13/2026

1. [](#bugfix)
   * The logo fallback was Quark 2's own leftover scaffold asset - Grav's
     product wordmark - plus a separate site-title span, rendering together
     as "[Grav wordmark] Tucek". Replaced with bastion-old's actual fallback:
     a single custom mark (images/bastion-mark.svg), shown alone.

# v0.1.10
## 09/13/2026

1. [](#bugfix)
   * Footer logo was invisible: nested `<a>` tags (invalid HTML) from
     wrapping an already-self-linking logo partial in a second link, plus
     the inline SVG itself collapsing to 0x0 under Tailwind's `height: auto`
     preflight rule with no width/height attributes to resolve it against.
   * The search form's input and button rendered stacked instead of inline -
     `display: flex` was on the wrong element (`.search-wrapper`, one level
     above the actual `<form>` containing the fields).

# v0.1.9
## 09/13/2026

1. [](#bugfix)
   * Using Tailwind's `gray-*` class names wasn't enough - its own default gray
     scale is different (bluer, higher-chroma) from bastion-old's, which
     overrides it entirely via a GitHub-flavored `@theme` scale. Ported all
     ten steps verbatim, so e.g. dark mode's `gray-900` background is now a
     true near-black (#0d1117) instead of Tailwind's default dark slate-blue.

# v0.1.8
## 09/13/2026

1. [](#bugfix)
   * Ported the menu panel's exact behavior from bastion-old: it's an
     accordion (children start collapsed behind a +/- toggle) on an always-
     dark card, not the always-expanded, adaptive-light/dark tree this build
     had. The header toggle button now morphs bars/xmark and its label swaps
     "Menu"/"Close", matching bastion-old instead of animating in place.
     Scroll lock now uses the real `overflow-hidden` utility instead of an
     unstyled leftover class.

# v0.1.7
## 09/13/2026

1. [](#bugfix)
   * Found the actual cause of "colors not right": this theme used Tailwind's
     `neutral` palette everywhere while bastion-old consistently uses `gray` -
     swapped every occurrence, and wired up `page.header.colors.text_style`
     which content sets per-section but nothing read.
   * The contact section's form was gated behind `page.header.form`, which no
     content sets, so it silently never rendered. Now included unconditionally
     like bastion-old, and styled the Form plugin's unstyled field/button classes.
   * Buttons had no pointer cursor (Tailwind preflight default); added a
     blanket rule to restore it.
   * Header z-index was lower than the nav panel's, covering the header's
     search/theme controls when the panel opened - swapped the order and
     removed the duplicate controls that had been added inside the panel to
     compensate.

2. [](#new)
   * Rebuilt the footer to match bastion-old: background band, social icons,
     markdown copyright, logo bottom-right - carrying over the real social
     links and copyright text as this theme's own defaults.
   * Rebuilt the theme switcher as a 3-way segmented pill (light/auto/dark,
     sliding indicator) instead of a single cycling icon button.

# v0.1.6
## 09/13/2026

1. [](#bugfix)
   * The nav panel had no backdrop-click-to-close - only the toggle button and
     nav links closed it, so clicking outside the card (the natural way to
     dismiss a modal) did nothing and the menu felt stuck open. Matched
     bastion-old's actual close behavior (toggle, link, backdrop, Escape) and
     its fade transition (invisible/opacity) instead of instant hidden/flex.

# v0.1.5
## 09/13/2026

1. [](#bugfix)
   * Rebuilt the header/nav to match bastion-old's actual structure: a single
     toggle button + centered nav panel used at every viewport (not a separate
     always-visible desktop bar plus a full-screen mobile overlay), no header
     logo (moved to the footer), and hover/active states now use the site's
     configured accent color instead of flat neutral grays.

# v0.1.4
## 09/13/2026

1. [](#new)
   * Added a search overlay - a centered, backdrop-blurred modal around the
     simplesearch plugin's searchbox, triggered from the desktop header and
     mobile menu, styled since that plugin ships no CSS of its own.

2. [](#bugfix)
   * The mobile menu had no way to close itself except tapping a nav link -
     the open overlay sits above the header and covers the hamburger button
     that would otherwise toggle it. Added an explicit close button.

# v0.1.3
## 09/12/2026

1. [](#bugfix)
   * The home page (and any modular page) defaulted to an unstyled on-page anchor
     menu instead of the site's real navigation, replacing it entirely - broke both
     the visible menu and the header's layout. Now opt-in per page via
     `onpage_menu: true`; defaults to the normal site nav like every other page.

# v0.1.2
## 09/12/2026

1. [](#bugfix)
   * Added the page/modular templates Quark 2's default set didn't ship that this
     site's actual content needs - `modular/image-block`, `modular/contact`,
     `partials/lightbox`, `post`, `recipe`, `recipes` - fixing "template not found"
     errors on the home page's About/Contact sections, blog posts, and recipes.
   * Fixed `modular/features.html.twig` reading `feature.header`/`feature.url` when
     this site's content uses `feature.title`/`feature.link` (rendered icons with
     no text), a `modular/gallery.html.twig` inline style referencing CSS variables
     removed along with `theme.css`, and `partials/hero.html.twig` only understanding
     a flat `hero_image` arg when all real content uses a nested `hero: {...}` block.

2. [](#new)
   * Tailwind pass on `blog.html.twig`, the blog list/date/title/taxonomy partials,
     `layout.html.twig`, and `default.html.twig`, plus a hand-written `.prose`
     ruleset in `custom.css` for readable body text.

# v0.1.1
## 09/12/2026

1. [](#new)
   * Reworked the layout shell - `base.html.twig`, the nav macro, footer, logo,
     theme toggle - with Tailwind utility classes, replacing Quark 2's Blades-CSS
     classless markup. JS-driven state hooks (`.dropmenu`, `.has-children`, `.open`,
     `.flip-x`, `#toggle.active`, `.scrolled`, `.overlay`) kept as-is so
     `site.js`/`theme-toggle.js` needed no changes.

2. [](#bugfix)
   * `theme-toggle.js` still stored the appearance preference under the old
     `quark2-theme` localStorage key, which didn't match `base.html.twig`'s
     `bastion-theme` pre-paint bootstrap - the stored preference was silently
     ignored on every reload. Renamed to match.

# v0.1.0
## 09/12/2026

1. [](#new)
   * Initial scaffold: copied from Grav's Quark 2 skeleton (MIT), renamed to Bastion,
     wired up the `tailwind4` plugin (PHP-compiled Tailwind CSS 4, no npm) in place of
     Quark 2's Blades CSS build. Templates still carry Quark 2's original markup and
     have not yet been reworked with Tailwind utility classes.
