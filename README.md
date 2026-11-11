# Bastion Theme

**Bastion** is a Grav CMS theme built on [Tailwind CSS](https://tailwindcss.com/) 4,
scaffolded from Grav's own [Quark 2](https://github.com/getgrav/grav-theme-quark2)
skeleton (MIT). It shares no code with Trilby Media's commercial Typhoon/Bastion
theme — it's an independent rebuild, not a fork.

## Build

CSS is compiled with the [`tailwind4`](../../plugins/tailwind4) Grav plugin (a PHP
port of the Tailwind engine) — no Node.js/npm toolchain required.

```
bin/plugin tailwind4 compile bastion
```

`build/css/site.css` is committed like any other theme asset. Recompile after
editing `css/site.css` or adding new Tailwind classes to templates.

## Architecture and integrations

The theme provides Tailwind layouts for standard pages, modular content,
blog posts, recipes, search, forms and navigation, plus light/dark mode.
Bastion Gallery supplies the page-gallery hook and lightbox assets.
Bastion NetDocs supplies its own templates, inheriting the theme base layout
and compiled CSS. Blog, recipe and device tags use separate taxonomies.

SimpleSearch supplies results at priority 0; NetDocs optionally promotes
device-name matches at -5; this theme paginates the final results at -10.
Preserve that order. Page-type filtering in `bastion.php` controls editorial
choices; server-side Grav/Login/API permissions control actual access.

## Requirements and validation

Runtime dependencies are declared in `blueprints.yaml`: Grav 2.1+,
Color Tools 1.1.1+, Shortcode Core 4.0+ and Bastion Gallery 3.1.0+.
The Tailwind4 plugin is a build dependency, not required to serve the committed
CSS. No Composer or npm command is needed for the CSS build.

Rebuild after changing theme CSS or adding Tailwind classes in theme or plugin
templates. Review and commit `build/css/site.css` with the relevant change.
No CSS rebuild is needed for changes that introduce no CSS or utility classes.

Run PHP syntax checks and parse affected YAML files. For cross-project changes,
run both plugin security scripts from the Grav root:

```bash
php user/plugins/bastion-gallery/tests/security.php
php user/plugins/bastion-netdocs/tests/security.php
```

Manually verify light/dark mode, mobile navigation, search pagination and both
shortcode/page galleries. Consult `AGENTS.md` for repository-specific rules.
