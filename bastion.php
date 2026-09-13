<?php
namespace Grav\Theme;

use Grav\Common\Grav;
use Grav\Common\Theme;
use Grav\Common\Twig\Twig;
use RocketTheme\Toolbox\Event\Event;
use RocketTheme\Toolbox\ResourceLocator\UniformResourceLocator;

class Bastion extends Theme
{
    /**
     * Page type (template) -> who gets to see it in the "choose page type"
     * picker. This is purely an editorial-UX filter, not access control -
     * every user here is trusted to edit every page; the point is just to
     * stop e.g. a recipe editor from being offered `vlan`/`device`/`post`
     * in a list they'll never use. A user who can't see a type can still be
     * handed a page of that type directly (by URL, sync, CLI, etc.) and
     * edit it normally - this only hides the type from the *creation*
     * picker.
     *
     * 'super' is a marker for Grav's own admin.super permission (site
     * owner/full admin); anything else names a plain group membership with
     * no access implications of its own - see user/config/groups.yaml.
     */
    private const RESTRICTED_PAGE_TYPES = [
        // Singleton pages - each exists exactly once, only the site owner
        // should ever need to create one again (e.g. after a rebuild).
        'blog'                  => 'super',
        'vlans'                 => 'super',
        'customers'             => 'super',
        // Structural/system types that aren't really "content" an editor
        // would ever choose to create.
        'root'                  => 'super',
        'error'                 => 'super',
        'simplesearch_results'  => 'super',
        'flex-objects'          => 'super',
        'form'                  => 'super',
        // Created repeatedly, but only by editors who own that section.
        'recipes' => 'recipesadmins',
        'recipe'  => 'recipesadmins',
        'post'    => 'blogadmins',
        'vlan'    => 'netdocsadmins',
        'device'  => 'netdocsadmins',
    ];

    public static function getSubscribedEvents(): array
    {
        return [
            'onThemeInitialized' => ['onThemeInitialized', 0],
            'onTwigLoader'       => ['onTwigLoader', 0],
            'onTwigInitialized'  => ['onTwigInitialized', 0],
            'onAdminPageTypes'   => ['onAdminPageTypes', 0],
        ];
    }

    /**
     * [onAdminPageTypes] Hide RESTRICTED_PAGE_TYPES from the page-type picker
     * for anyone who isn't a super admin or in the type's assigned group.
     * A super admin always sees every type, restricted or not.
     *
     * Ported from bastion-old, where a fix in the `api` plugin
     * (AuthMiddleware::setActiveUser(), getgrav/grav-plugin-api#36) was
     * needed before $grav['user'] reflected the real authenticated account
     * on this event rather than guest - check that plugin's version if this
     * silently stops filtering for everyone again.
     */
    public function onAdminPageTypes(Event $event): void
    {
        $user = $this->grav['user'] ?? null;
        if (!$user || $user->authorize('admin.super') === true) {
            return;
        }

        $userGroups = (array) $user->get('groups');
        $types = $event['types'] ?? [];

        foreach (self::RESTRICTED_PAGE_TYPES as $type => $group) {
            if (!isset($types[$type])) {
                continue;
            }
            if ($group !== 'super' && in_array($group, $userGroups, true)) {
                continue;
            }
            unset($types[$type]);
        }

        $event['types'] = $types;
    }

    public function onThemeInitialized(): void
    {
    }

    public function onTwigLoader(): void
    {
        /** @var UniformResourceLocator $locator */
        $locator = Grav::instance()['locator'];
        /** @var Twig $twig */
        $twig = $this->grav['twig'];
        foreach ((array) $locator->findResources('theme://images') as $path) {
            $twig->addPath($path, 'images');
        }
    }

    public function onTwigInitialized(): void
    {
        /** @var Twig $twig */
        $twig = $this->grav['twig'];

        $form_class_variables = [
            'form_button_outer_classes' => 'button-wrapper',
            'form_button_classes'       => 'contrast',
            'form_errors_classes'       => 'form-errors',
            'form_field_outer_classes'  => 'form-group',
            'form_field_outer_label_classes' => 'form-label-wrapper',
            'form_field_label_classes'  => 'form-label',
            'form_field_input_classes'  => 'form-input',
            'form_field_textarea_classes' => 'form-input',
            'form_field_select_classes' => 'form-select',
            'form_field_radio_classes'  => 'form-radio',
            'form_field_checkbox_classes' => 'form-checkbox',
        ];

        $twig->twig_vars = array_merge($twig->twig_vars, $form_class_variables);

        $twig->twig->addFunction(new \Twig\TwigFunction('q2_mix_white', [$this, 'mixWithWhite']));
        $twig->twig->addFunction(new \Twig\TwigFunction('q2_mix_alpha', [$this, 'mixWithAlpha']));
        $twig->twig->addFilter(new \Twig\TwigFilter('fa_icon', [$this, 'faIconClass']));
    }

    /**
     * Turn an icon value into the Font Awesome classes that render it.
     *
     * Icon values reach a template in several shapes. Admin Next's icon picker
     * stores a solid icon as `fa-house` and the other families as
     * `fa-brands fa-github`; a value typed by hand, or carried over from a
     * Grav 1 site, arrives bare (`house`) or in the old Font Awesome 4 form
     * (`fa fa-house`). The templates used to write `fa-solid fa-{{ icon }}`,
     * which turns a picked `fa-house` into `fa-solid fa-fa-house` and renders
     * nothing, so an icon disappeared the moment it was changed in the admin
     * (getgrav/grav-skeleton-onepage-site#20).
     *
     * @param string|null $icon
     * @return string
     */
    public function faIconClass(?string $icon): string
    {
        $icon = trim((string) $icon);
        if ($icon === '') {
            return '';
        }

        $families = [
            'fa-solid'   => 'fa-solid',   'fas' => 'fa-solid',
            'fa-regular' => 'fa-regular', 'far' => 'fa-regular',
            'fa-brands'  => 'fa-brands',  'fab' => 'fa-brands',
        ];

        $family = '';
        $name   = '';

        foreach (preg_split('/\s+/', $icon) ?: [] as $token) {
            if (isset($families[$token])) {
                $family = $families[$token];
                continue;
            }
            // A bare `fa` or `fa-classic` names the family without naming a
            // glyph, so it must not be mistaken for the icon name.
            if ($token === 'fa' || $token === 'fa-classic') {
                continue;
            }
            $name = preg_replace('/^fa-/', '', $token);
        }

        if ((string) $name === '') {
            return '';
        }

        return ($family !== '' ? $family : 'fa-solid') . ' fa-' . $name;
    }

    public function mixWithWhite(string $hex, int $pct): string
    {
        [$r, $g, $b] = $this->parseHex($hex);
        $f = max(0, min(100, $pct)) / 100;
        $mr = (int) round($r * $f + 255 * (1 - $f));
        $mg = (int) round($g * $f + 255 * (1 - $f));
        $mb = (int) round($b * $f + 255 * (1 - $f));
        return "rgb({$mr}, {$mg}, {$mb})";
    }

    public function mixWithAlpha(string $hex, int $pct): string
    {
        [$r, $g, $b] = $this->parseHex($hex);
        $a = round(max(0, min(100, $pct)) / 100, 2);
        return "rgba({$r}, {$g}, {$b}, {$a})";
    }

    /**
     * @param string $hex
     * @return array{0: int, 1: int, 2: int}
     */
    private function parseHex(string $hex): array
    {
        $hex = ltrim($hex, '#');
        if (strlen($hex) === 3) {
            $hex = $hex[0].$hex[0].$hex[1].$hex[1].$hex[2].$hex[2];
        }
        if (strlen($hex) < 6) {
            return [0, 0, 0];
        }
        return [
            hexdec(substr($hex, 0, 2)),
            hexdec(substr($hex, 2, 2)),
            hexdec(substr($hex, 4, 2)),
        ];
    }
}
