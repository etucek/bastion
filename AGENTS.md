# Bastion theme

Follow /srv/http/www-data/AGENTS.md and the user's approved task scope.

- Preserve Twig blocks, plugin template inheritance, gallery hooks and native Grav configuration.
- PHP page-type filtering is editorial UI, not authorization.
- Keep post, recipe and device taxonomies separate.
- Search pagination runs after NetDocs result prioritization (-10 versus -5).
- CSS source: css/site.css; tracked output: build/css/site.css. Compile from Grav root with php bin/plugin tailwind4 compile bastion when classes or CSS change.
- No Node/npm build chain is required. Avoid editing generated CSS directly.
- Preserve local GLightbox patches and licenses; Gallery also carries a copy.
- Check light/dark mode, navigation, search pagination and galleries in a browser after relevant changes.
