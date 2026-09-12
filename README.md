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

## Status

This theme is in early scaffolding: the Tailwind build pipeline is wired up, but
the page templates still carry Quark 2's original Blades-CSS-oriented markup and
need to be reworked with Tailwind utility classes.
