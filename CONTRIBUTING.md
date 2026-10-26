# Working on the Carnegie Mellon Web Kit

## Rules for Components

* **The template comes first.** Link its CSS and use its classes as they
  are: `btn`, `btn small`, `ghost`, `cta`, `table.alternate`, `.sidebar`,
  `.sr-only`. Never copy its rules or values. Add a component only where
  the template has nothing.
* **Prefix `cmu-`** for every class, custom property (`--cmu-red`), and JS
  hook. Modifiers use `--` (`cmu-pill--green`).
* `cmu-cms.css` is for anything a Cascade page could use; `cmu-app.css` is
  for what only apps need.
* Every component gets a section in the docs with a live example.

## Folders

Named the way CMU's own sites name them (`/common/standard-v6/css/`,
`/common/standard-v6/js/`, `/common/standard-v6/images/`):

* `css/`: stylesheets.
* `js/`: JavaScript that runs in the browser. Never `javascript/` or
  `scripts/`.
* `images/`: images, never `img/`.
* `tools/`: scripts you run from the command line (checks, the
  components table, releases). Elsewhere these go in `scripts/`; that name
  is only ever for command-line and ops scripts, never browser code.

The docs follow the same rule: `docs/css/`, `docs/js/`, `docs/images/`.

## Docs

The docs are in `docs/` and published with GitHub Pages from the `main`
branch, root folder. They load `../css/`, so the site is served from the
root, not from `docs/`. To view them locally:

```sh
python3 -m http.server 8123
```

then open http://127.0.0.1:8123/docs/.

Write each example once inside a `.kit-demo` block; `docs/js/docs.js` shows
its markup under it. The live examples use the CSS on `main`, so mark
anything not yet released ("New in 0.2") until it is.

## Checks

`npm run check` fails if the live CMU template starts defining one of our
class names, if a version in the docs or README doesn't match
`package.json`, or if the table of every component on the Components page
is out of date. Rebuild that table with `npm run components` after adding,
renaming or removing a section.

## Releasing

1. `npm run release -- 0.2.0` sets the version in `package.json` and in
   every example in the docs and README.
2. Commit, tag, and push:
   `git commit -am "chore: release 0.2.0" && git tag 0.2.0 && git push && git push --tags`
3. On GitHub, add release notes to the tag. For a major version, list
   every renamed or removed class.

jsDelivr serves each tag as soon as it's pushed. Versions follow semver:
renaming or removing a class is a major version.
