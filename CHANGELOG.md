# v1.3.2
## 09/15/2026

1. [](#bugfix)
   * `page.prevSibling`/`page.nextSibling` (used for the Previous/Next Post nav on `post.html.twig` and `recipe.html.twig`) rendered a link even at the very first/last item, going nowhere (`href=""`). Cause: `Collection::adjacentSibling()` (Grav core) returns the collection itself at the boundary instead of `false`, so a bare `{% if page.prevSibling %}` is always true - a Collection object is truthy regardless. Checking `.url` instead of the object itself fixes it without touching core: a real sibling page's url is never empty, but the bug's fallback return value has none.

2. [](#new)
   * Added "Search Results Per Page" to the theme's Search section (Admin) - previously hardcoded to 10 in `bastion.php` with no way to change it, unlike Recipes' own per-page Items field.

# v1.3.1
## 09/15/2026

1. [](#new)
   * Added pagination to `simplesearch_results.html.twig` (10 results per page) - it previously rendered every match on one page with no way to page through them. Simplesearch builds its results collection by hand instead of through `Pages::getCollection()`, so neither of the two things that method normally does for a paginated collection happened on their own; `bastion.php`'s new `onTwigSiteVariables()` reproduces both (firing `onCollectionProcessed` so the pagination plugin builds its nav, then slicing to the current page) in the same order core uses. Also fixed the "X results found" summary, which would otherwise have reported only the current page's count once pagination was slicing it down.
   * `07.recipes/recipes.md` had no `content:` block at all, so `recipes.html.twig`'s existing pagination code (identical to blog's) never had anything to paginate - added the same `limit`/`order`/`pagination: true` config `blog.md` uses. Also published the page (`published: false` -> `true`); it was previously unreachable on the live site.

# v1.3.0
## 09/15/2026

1. [](#new)
   * Redesigned `error.html.twig` - it was completely unstyled (bare `<h1>`/`<p>`, plus a `.btn` class that no longer exists anywhere in the theme's CSS). Now shows a large muted status code, the translated error message, an accent-colored "Back to homepage" button, and a "Search" button that opens the existing search overlay (when simplesearch is enabled) - fully light/dark aware, matching the rest of the theme. Purely driven by the same two data points the old template used (`page.header.http_response_code`, `page.content`), so it isn't tied to 404 specifically.

# v1.2.8
## 09/15/2026

1. [](#improved)
   * The mobile menu toggle's pill border now hides alongside its "Menu"/"Close" text label below the `md` breakpoint (`border-0 md:border`), instead of leaving an empty pill outline around a bare icon - matches the icon-only look of its sibling header buttons (search, login) at that size.

# v1.2.7
## 09/15/2026

1. [](#bugfix)
   * The mobile nav toggle's "Menu"/"Close" text label had no responsive classes at all, so it showed on every screen size instead of only desktop - added `hidden md:inline`, matching the icon-only-on-mobile pattern the rest of the header already uses.
2. [](#improved)
   * Gave the mobile nav panel's scrollbar the same slim treatment `.prose pre` code blocks already use (`scrollbar-width: thin` + a `::-webkit-scrollbar` override) instead of the platform default, which was wide enough to visibly shrink the menu items on platforms without an overlay scrollbar.

# v1.2.6
## 09/15/2026

1. [](#bugfix)
   * v1.2.5's mobile nav submenu accordion animation used `max-h-96` (24rem) as its "open" cap, sized against a submenu that happened to fit - a menu item with more children than that (e.g. Tech's 9) got clipped at 24rem with no way to reach the rest, hidden behind whatever rendered next. `max-height` inherently needs a guessed-tall-enough cap; switched to the `grid-template-rows: 0fr -> 1fr` technique instead, which animates to the content's actual height, however tall that turns out to be, with nothing to guess.

# v1.2.5
## 09/15/2026

1. [](#improved)
   * Language switcher dropdown and the mobile nav's nested-submenu accordion both used a hard `hidden` (display:none) toggle, snapping open/closed instantly - unlike the mobile nav overlay and search overlay, which already fade via `invisible`/`opacity-0`/`opacity-100`. Switched both to the same fade idiom: the dropdown now fades + slides in slightly (`[&.open]:visible [&.open]:opacity-100 [&.open]:translate-y-0`), and the submenu accordion animates open via `max-height`/`opacity` instead of popping.
   * Removed the `.dropmenu`/`.dropmenu-panel`/`.flip-x`/`.has-children` mechanism from `site.js` and `custom.css` (~35 lines of JS, one CSS rule) - leftover from before the nav was rewritten to the current `data-menu-*` attribute system. `class="dropmenu"` was never applied anywhere in any template, so `document.querySelectorAll('.dropmenu ...')` always returned nothing; it ran as a no-op on every page load.

# v1.2.4
## 09/15/2026

1. [](#bugfix)
   * Fixed the transparent header "pushing" content down when scrolling past the threshold (smooth scrolling back up, jarring going down). Root cause: the header switched `position: absolute` -> `sticky` at the `.scrolled` boundary, and that switch re-inserts the header's own height into document flow in one frame - shifting the hero/content down by ~64px instantly. `position` can't be transitioned either way, so no `transition:` fix could smooth it out. Changed to a constant `position: fixed` for the whole hero-transparent state instead of toggling - fixed never reserves flow space, so there's no insertion to jump on in the first place, going down or up.

# v1.2.3
## 09/15/2026

1. [](#improved)
   * Smoothed the transparent-header-to-scrolled transition: `color` and `backdrop-filter` were never in the header's `transition:` list, so the header-dark/header-light text color and the backdrop blur snapped instantly at the `.scrolled` threshold while background-color/border-color/box-shadow faded - inconsistent and jarring. Also added a `transition` to the header's own descendants (nav links, icons, buttons), since the header-dark/header-light override sets `color` on each of them individually via `#header:has(+ .hero-section) *`, and a child element doesn't inherit its parent's `transition` property.

# v1.2.2
## 09/15/2026

1. [](#other)
   * Removed five templates nothing referenced anywhere in the theme (confirmed via a full repo-wide grep, including all plugins): `partials/archives.html.twig` and `partials/taxonomylist.html.twig` (leftover sidebar widgets from before this fork dropped the sidebar entirely - the Archives/TaxonomyList plugins' own templates at the same path are unaffected), `partials/relatedpages.html.twig` (same - nothing ever called the relatedpages plugin's data), `partials/blog-item.html.twig` (pre-Tailwind leftover from the original upstream fork, using old classes like `content-item`/`h-entry`/`e-content`/`btn btn-ghost` - superseded by `blog-list-item.html.twig`), and `partials/blog/page-summary.html.twig` (only ever included by the now-removed `blog-item.html.twig`).

# v1.2.1
## 09/15/2026

1. [](#bugfix)
   * The v1.2.0 Hero-tab "Transparent Header"/"Header Text" override had no effect on `post.html.twig`/`recipe.html.twig`: unlike `default`/`blog`/`recipes` (which all render their hero through `partials/hero.html.twig`), these two build their own simpler inline hero `<section>` and it was missing the `hero-section` class the CSS relies on (`#header:has(+ .hero-section)`) to detect that a hero follows the header. Added the class to both - same fix, same root cause in both files.

# v1.2.0
## 09/15/2026

1. [](#new)
   * Added "Transparent Header" and "Header Text" (auto/light/dark) to a page's Hero tab, under Display - lets a page with a hero image opt into a header that floats transparently over the image (light or dark text/icons, your choice, to stay readable against that specific image) and settles back into the site's normal header style once scrolled. Reuses the existing site-wide `header-transparent`/`header-dark`/`header-light` CSS and scroll-transition logic (`css/custom.css`, `js/site.js`) - `body_class()`'s per-page/theme-config fallback already supported this, it just had no per-page UI wired up to it yet. Additive: a page can turn these on over the site default, not force them off. Only applies to `page.header.hero`, same as the rest of the Hero tab - not a modular page's hero, which comes from a separate child page and was already outside what the site-wide toggle could see either.

# v1.1.5
## 09/14/2026

1. [](#improved)
   * Rebuilt `build/css/site.css` for `bastion-netdocs` v1.4.5's `device.html.twig` change (Created/Modified moved under the title, stacked).

# v1.1.4
## 09/14/2026

1. [](#improved)
   * Rebuilt `build/css/site.css` to pick up the new Created/Modified date classes added to `bastion-netdocs`'s `device.html.twig` (v1.4.4) - the tailwind4 build scans every enabled plugin's templates automatically, this was just the artifact catching up.

# v1.1.3
## 09/14/2026

1. [](#bugfix)
   * `default.html.twig` was the only content template still capping its article at `prose mx-auto max-w-3xl`, instead of `prose max-w-none` like `post`, `recipe`, `blog` and `modular/image-block` all already use - so a plain page rendered noticeably narrower than everything else, including `vlans`/`modular` which fill the shared `max-w-6xl` container from `base.html.twig` with no extra cap of their own. Switched to `max-w-none` to match.

# v1.1.2
## 09/14/2026

1. [](#improved)
   * Switched the theme's own accent-colored links/hovers (`text-[var(--accent)]`, `hover:text-[var(--accent)]`, `hover:border-[var(--accent)]`) to the real `primary` Tailwind color token (`text-primary`, `hover:text-primary`, `hover:border-primary`) instead of the arbitrary-value syntax. `--color-primary: var(--accent)` in `css/site.css` was already declared for this purpose - it just wasn't used by the theme's own templates yet, only relied on by content frontmatter. No visual change; picks up standard Tailwind opacity-modifier/tooling support for free.

# v1.1.1
## 09/14/2026

1. [](#bugfix)
   * Accent Color setting was never actually applied - `bastion.yaml` (the theme's own shipped defaults, which is what `theme_var()` resolves at runtime) still hardcoded the old `#242424` after `blueprints.yaml`'s form field default was changed to `#A664E8`; only the latter got updated, so the configured color was silently ignored. Synced the two.
   * The mobile nav dropdown panel (`bg-gray-800/95` in `base.html.twig`) and its menu-item text/hover colors (`macros.html.twig`) were hardcoded dark with no light-mode variant, so it rendered as a dark floating panel regardless of the selected theme instead of adapting like the rest of the site. Added light-mode classes alongside the existing `dark:` ones, and gave the item divider (`navigation.html.twig`) the same treatment.

# v1.1.0
## 09/14/2026

1. [](#other)
   * Declared `color-tools` (`>=1.1.1`), `shortcode-core` (`>=4.0.0`) and `bastion-gallery` (`>=3.1.0`) as explicit dependencies in `blueprints.yaml`.

# v1.0.8
## 09/13/2026

1. [](#bugfix)
   * recipe.html.twig never checked the Enable Comments toggle at all -
     turning it on for a recipe page did nothing. Added the same
     check/include post.html.twig already uses.

# v1.0.7
## 09/13/2026

1. [](#bugfix)
   * Fixed "end of the stream or a document separator is expected (1:1)"
     when opening/saving the Recipes or Blog tab's Items field - its
     default was a bare '@self.children' scalar, which is invalid as a
     standalone YAML document ('@' is a reserved indicator). Switched to
     the equivalent list form.

# v1.0.6
## 09/13/2026

1. [](#improvement)
   * bastion.php: $user's docblock now names AuthorizeInterface directly
     as an intersection type - phpactor's worse-reflection doesn't walk
     UserInterface's own "extends AuthorizeInterface" to find
     authorize(), so the warning persisted through v1.0.4/v1.0.5's fixes.

# v1.0.5
## 09/13/2026

1. [](#improvement)
   * bastion.php: split filterPageTypes()'s null-guard into its own
     early return - some IDEs don't narrow $user across a single
     ||-chained condition, so the authorize() warning persisted even
     with the @var docblock from v1.0.4.

# v1.0.4
## 09/13/2026

1. [](#improvement)
   * bastion.php: added a @var UserInterface docblock in
     filterPageTypes() so authorize()/get() resolve in an IDE.

# v1.0.3
## 09/13/2026

1. [](#improvement)
   * The Advanced tab's "Page Template" dropdown (for changing an
     existing page's template) now respects the same group-based
     restriction as the create-page picker - it was a separate,
     unfiltered code path before, so a restricted type was still
     reachable from there even with the picker filtered.

# v1.0.2
## 09/13/2026

1. [](#improvement)
   * Added 'comments' to the page types restricted to super admins in
     the type picker - same treatment as root/error/form/etc.

# v1.0.1
## 09/13/2026

1. [](#new)
   * Ported onAdminPageTypes from bastion-old: the "choose page type"
     picker in Admin now hides page types (vlan, device, post, recipe,
     recipes, and singleton/system types) from anyone outside the
     matching group (netdocsadmins/blogadmins/recipesadmins) or a super
     admin. The groups already existed in user/config/groups.yaml; the
     theme just never read them.

# v1.0.0
## 09/13/2026

1. [](#new)
   * First stable release.

# v0.1.33
## 09/13/2026

1. [](#improvement)
   * `<pre>` background in dark mode is a bit lighter now, matching the
     same tint used for inline code.

# v0.1.32
## 09/13/2026

1. [](#bugfix)
   * Every hero banner (default.html.twig and any modular template) was
     showing the page's entire body content instead of the short
     hero.content header field - Grav injects a global `content`
     variable into every template's context, so partials/hero.html.twig's
     `content is defined` check was always true. Made /tech look
     strangely tall with the whole article crammed into the banner.
     Renamed the override parameter so it can't collide with Grav's own
     globals.

# v0.1.31
## 09/13/2026

1. [](#improvement)
   * bastion.php: added a shaped-array @return docblock to parseHex() so
     its [$r, $g, $b] = ... destructuring resolves in an IDE.

# v0.1.30
## 09/13/2026

1. [](#new)
   * Added composer.json (standard Grav theme metadata, classmap
     autoload for bastion.php) so the theme can be required via
     Composer/Packagist, not just GPM.

2. [](#improvement)
   * bastion.yaml (the theme-shipped defaults) was actually this site's
     live accent color, personal social links, and old copyright text -
     not a usable starting point for a new install. Genericized it
     (accent-color now matches the blueprint field's own stated default
     instead of silently contradicting it; social links empty; copyright
     a plain placeholder) and moved this site's real values to
     user/config/themes/bastion.yaml, where site-specific config
     belongs.

# v0.1.29
## 09/13/2026

1. [](#bugfix)
   * Audited every field on the Hero tab against what actually reads it.
     header.hero.overlay (dark/light/none) was never wired up at all;
     header.section_classes only worked on modular pages; recipe.html.twig
     and recipes.html.twig had zero hero support despite inheriting the
     full Hero tab. All fixed - see CHANGELOG detail in the commit.
   * blog.html.twig's hero image fallback checked a header field
     (hero_image) that never actually existed, instead of the real
     nested hero.image.
   * Added the missing header.show_pagination field to recipe.yaml and
     recipes.yaml (the toggle worked, it just wasn't reachable from
     Admin).

2. [](#improvement)
   * Removed blueprints/item.yaml and partials/blog-bits.yaml - dead,
     unreachable Quark2-era blueprint with no template to render it.
   * bastion.php: added missing return types and locator/twig docblocks.

# v0.1.28
## 09/13/2026

1. [](#bugfix)
   * Header control borders (menu, language switcher, theme toggle) now
     match bastion-old exactly, and the language switcher toggle button
     has a border like the other two - it had none.
   * Language switcher ignored plugins.langswitcher.language_display -
     both the button label and dropdown items were hardcoded to one
     format regardless of that setting. Now reads it, matching the
     plugin's own short/long partials.

# v0.1.27
## 09/13/2026

1. [](#bugfix)
   * Fixed the "preloaded but not used" DevTools warning for Cal Sans -
     it was loaded and preloaded but never actually applied anywhere. Now
     used as the heading font (h1-h6) site-wide.
   * Mobile-nav-toggle border, theme-toggle border, and footer social
     icon circles were nearly invisible in dark mode (too close in value
     to the surrounding background). Increased contrast, and gave the
     footer its own dark background instead of matching `<body>` exactly.

# v0.1.26
## 09/13/2026

1. [](#new)
   * Footer is now configurable in theme settings: copyright text, a
     footer nav menu (with its own show/hide toggle), and social links
     (with their own show/hide toggle) - previously only editable by
     hand-editing bastion.yaml.
   * Wired up `bastion_gallery_section()` (bastion-gallery plugin) so the
     per-page gallery field it already injects into every page blueprint
     actually renders - it was never called from any template.

2. [](#bugfix)
   * Header Transparent / Header Text Light / Header Text Dark did
     nothing - config existed, no CSS ever read it. Implemented: the
     header now sits transparently over a page's hero image until
     scrolled, with white/near-black text as configured.

# v0.1.25
## 09/13/2026

1. [](#bugfix)
   * Custom favicon `<link>` had an empty `type=""` attribute -
     `get_mime_type()` is a bastion-old-only function, undefined here, and
     Grav's undefined-function handling resolves silently to null rather
     than erroring. Used the file field's own upload metadata instead.

# v0.1.24
## 09/13/2026

1. [](#new)
   * Added a language switcher dropdown in the header (site has 3
     configured languages; there was previously no way to switch on the
     frontend), with its own `langswitcher.enabled` toggle.

2. [](#bugfix)
   * Code inside `<pre>` blocks kept the inline-code background tint per
     line in dark mode - a CSS specificity gap (`.dark .prose code`, 2
     classes, was beating `.prose pre code`, 1 class + 2 elements,
     regardless of source order).
   * Logged-out header icon was `fa-right-to-bracket`; switched to
     `fa-user` to match the established login-icon convention.
   * Login plugin's login page (`#grav-login`) was a hardcoded light card
     with no dark mode styling.
   * Replaced the default Grav/Quark screenshot.jpg, thumbnail.jpg and
     favicon.png placeholders with the site's own branding.

3. [](#improvement)
   * Removed the Font Awesome enabled/local toggles - this install only
     ever serves it locally, so both toggles and the CDN branch were dead
     weight.

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
