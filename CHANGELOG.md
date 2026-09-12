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
