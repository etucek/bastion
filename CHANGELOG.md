# v0.1.23
## 09/13/2026

1. [](#improvement)
   * `<pre>`/`<code>` used a flat dark block in both light and dark mode.
     Ported bastion-old's adaptive GitHub-style treatment instead.
   * Added a `login.enabled` theme setting and a login icon in the header
     for anonymous visitors (previously only the logged-in state rendered,
     with no way to actually reach the login page from the frontend).
   * Added a Custom Favicon field, falling back to the theme default.
   * Styled `partials/breadcrumbs.html.twig`'s output, which had no CSS
     at all before now.

# v0.1.22
## 09/13/2026

1. [](#bugfix)
   * The simplesearch results page had no theme template, falling back to
     the plugin's unstyled default markup. Added a Google-style results
     page (url breadcrumb, title link, snippet) matching bastion-old.
   * recipes.html.twig and recipe.html.twig were built from the blueprint
     alone, without checking bastion-old's actual template - missing
     breadcrumbs, icon-based prep/cook time & servings & difficulty meta,
     the ingredients/instructions grid layout, and prev/next pagination.
     Rebuilt both, plus a new recipe-item.html.twig card for the listing.

# v0.1.21
## 09/13/2026

1. [](#bugfix)
   * blog.yaml's config tab was labeled "Post" in Admin (copy-paste leftover
     from adapting post.yaml) - fields were always correct, only the tab
     title was wrong.
   * The blog listing's menu item kept an expand toggle (+) even with posts
     excluded from the panel, since `has_children` counted them before that
     exclusion applied. Now uses the same filter.
   * Added the missing `title:` field to the home page's contact section
     (content, not theme code) - it never had one.

# v0.1.20
## 09/13/2026

1. [](#bugfix)
   * Contact form submit button was unstyled - wrong CSS selector, plus
     `hover:bg-primary` (set in the page's own form config) needed a real
     `--color-primary` Tailwind token this theme never defined. Added it,
     fixed the selector, and gave every submit button baseline padding.
   * FontAwesome was CDN-only; bundled it locally like bastion-old and
     fixed the (wrong) local path this theme referenced.
   * Opening the nav panel shifted the whole page right by the scrollbar's
     width. Added `scrollbar-gutter: stable`.
   * Blog posts appeared in the main nav. Excluded post/recipe templates
     from the nav loop regardless of folder-prefix visibility.
   * Visible seam between sections in dark mode: `<body>` used Tailwind's
     stock (uncustomized) gray-950 while sections use this theme's custom
     gray-900 - changed body/header to match exactly.

# v0.1.19
## 09/13/2026

1. [](#bugfix)
   * Fixed a Twig `default()` gotcha in modular/partials/title.html.twig that
     silently coerced an explicit `include_content: false` back to `true`,
     causing the About section's content to render twice.
   * Ported Admin blueprints for every page type from bastion-old, adapted to
     what this theme's templates actually read: contact and image-block had
     no blueprint at all (hence the untitled "_contact" page and no Title
     field when editing About), and features/gallery still referenced the
     pre-fix Quark 2 field names. Also wired up recipe.html.twig and
     post.html.twig to actually use the newly-exposed fields instead of
     letting them be no-ops in the editor.

# v0.1.18
## 09/13/2026

1. [](#bugfix)
   * Every modular template had its own left-aligned title instead of
     sharing bastion-old's centered modular/partials/title.html.twig
     (narrow column, optional subtitle, title, optional content). Ported
     it and switched features/image-block/contact/gallery to use it.
     Also compared gallery.html.twig against bastion-old's real version
     for the first time and added the hover scale/brightness effect and
     corrected default grid classes.

# v0.1.17
## 09/13/2026

1. [](#bugfix)
   * Found while chasing "comments don't match the site": the accent color
     has actually been rendering as generic blue (#2563eb) instead of the
     configured purple (#8428DF) on every page this whole build. Two
     competing `:root` blocks defined the same custom properties, and the
     external stylesheet's fallback always loaded after (and so beat) the
     real per-page inline value. Now there's exactly one definition.
   * comments-pro ships its own accent_color setting that injects a late
     inline style overriding the comment UI's colors regardless of theme
     CSS - disabled it and remapped the plugin's color tokens onto this
     theme's own instead.
   * Form/search inputs, prose blockquotes/code blocks now use the theme's
     actual color tokens instead of independent hardcoded hex values.

# v0.1.16
## 09/13/2026

1. [](#bugfix)
   * Blog cards had no cap on summary length, so one long post forced every
     card in its grid row to match its height (measured 645px cards). Capped
     summaries to 170 characters with an ellipsis - card height dropped to
     505px with the same content.

# v0.1.15
## 09/13/2026

1. [](#bugfix)
   * `blog.html.twig` still had Quark 2's two-column sidebar layout, despite
     bastion-old dropping the sidebar site-wide (its own CHANGELOG v3.2.2).
     Removed it in favor of a plain full-bleed 4-column card grid, redesigned
     the post card to match bastion-old's actual styling, and switched
     post.html.twig's prev/next nav to centered bordered pills. Deleted the
     now-fully-dead item.html.twig/layout.html.twig/sidebar.html.twig.

# v0.1.14
## 09/13/2026

1. [](#bugfix)
   * `default.html.twig` never rendered a hero at all - pages like `/tech`
     with a configured hero image/content were silently showing nothing.
   * `partials/hero.html.twig` used a flat overlay instead of the
     direction+two-stop gradient every page's `overlay_gradient`/
     `overlay_direction` fields configure.
   * The home page's English "Welcome" section never rendered its title/
     subtitle/content at all - its hero.display flag is only set on the
     Swedish translation, and the dedicated hero template shouldn't gate
     on that flag in the first place (it's for other templates opting in).

# v0.1.13
## 09/13/2026

1. [](#bugfix)
   * `modular/features.html.twig`'s vertical/horizontal variation logic was
     backwards - both variations grid multi-column in bastion-old, the
     variation only picks each item's internal layout (icon-over-text vs.
     icon-beside-text). "What's on this website" (variation: vertical)
     was collapsing to one narrow centered column instead of a proper
     multi-column grid.

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
