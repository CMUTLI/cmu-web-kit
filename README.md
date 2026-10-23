# cmu-web-kit

Components for pages built on Carnegie Mellon's web template
(`www.cmu.edu/common/standard-v6`): CMS sites edited in Cascade, and web
apps that wear the same template.

| File | Load it on | What's in it |
| --- | --- | --- |
| `css/cmu-cms.css` | CMS sites and apps | Colors, page content: hero, path cards, steps, check lists, callouts, notes, text-plus-screenshot layout, pills, tables, "On this page" box |
| `css/cmu-app.css` | Apps, after cmu-cms.css | Forms, account link in the header, tabs, banners, dialogs and file drop zones, bulk selection bar, row buttons, sortable headers, filters, progress bars, folded lists, framed-tool panels |

Each site or app adds its own stylesheet last, for what's particular to
it, with its own prefix.

**Documentation:** https://cmutli.github.io/cmu-web-kit/ (from `docs/`):
how to add the kit to a Cascade site or an app, and every component with a
live example and its markup. To publish it, turn on GitHub Pages for the
repo from the `main` branch, root folder; the docs load `../css/`, so the
site must be served from the root, not from `docs/`. Edit the examples in
`docs/*.html`; `docs/docs.js` shows each example's markup under it.

## Using it

Load the template first, then these, then your own stylesheet. Use `<link>`
tags, not CSS `@import` (imports load one after another).

```html
<link href="https://www.cmu.edu/common/standard-v6/css/main.6.7.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/gh/CMUTLI/cmu-web-kit@0.1.0/css/cmu-cms.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/gh/CMUTLI/cmu-web-kit@0.1.0/css/cmu-app.css" rel="stylesheet">  <!-- apps only -->
<link href="/your-app.css" rel="stylesheet">
```

- **CMS sites:** add the links in the site's head block. Pin an exact
  version; moving to a new one is a one-line edit.
- **Apps:** copy the pinned release into the app at build time (e.g. an
  npm dependency on the git tag) rather than loading it from the CDN, so
  the app doesn't depend on jsDelivr being up.
- App pages put `cmu-app` on `<body>` (full CMU chrome) or `cmu-framed`
  (shown inside another tool, such as a Canvas LTI frame, without it).

## Rules

- **The template comes first.** Link its CSS and use its classes as they
  are: `btn`, `btn small`, `ghost`, `cta`, `table.alternate`, `.sidebar`,
  `.sr-only`. Never copy its rules or values. Add a `cmu-` class only where
  it has nothing.
- **Prefix `cmu-`** for every class, custom property (`--cmu-red`) and JS
  hook here. Modifiers use `--` (`cmu-pill--green`). Sites and apps use
  their own prefix for their own classes, never `cmu-`.
- `npm run check` fails if the live template ever defines one of our class
  names.
- **Template quirks** this works around: it makes tables `display: block`
  (use `table.cmu-full` to stretch one); its script strips `style=""` from
  spans (use divs); `.content > div` is an inline-block, so pages need one
  wrapper `<div>` inside `.content`; `.btn` and friends beat a bare
  `[hidden]`.

## Writing conventions (for pages using these components)

- Title Case for buttons, headings, labels and navigation; sentence case
  for sentences. "Sign In", not "Log In".
- Links go somewhere; buttons do something.
- A link that needs sign-in gets plain-text " [login required]" after it;
  a file link gets its type, " [PDF]". One label only.
- Never leave a lone "a" at the end of a line (`&nbsp;`).

## Releasing

1. `npm run release -- 0.2.0` sets the version in `package.json` and in
   every copy-paste example in the docs and this README.
2. Commit, tag and push, as it prints:
   `git commit -am "Release 0.2.0" && git tag 0.2.0 && git push && git push --tags`
3. On GitHub, add release notes to the tag. For a major version, list
   every renamed or removed class.

jsDelivr serves each tag at
`https://cdn.jsdelivr.net/gh/CMUTLI/cmu-web-kit@0.1.0/css/…` as soon as
it's pushed. `npm run check` fails if an example's version doesn't match
`package.json`. Versions follow semver: renaming or removing a class is a
major version.

The docs' live examples load `../css/` from `main`, so they can show
changes that aren't released yet. Mark those in the docs ("New in 0.2")
until the release.
