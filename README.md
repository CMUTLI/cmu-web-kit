# Carnegie Mellon Web Kit

The Carnegie Mellon Web Kit (`cmu-web-kit`) is a set of ready-made page
components for Carnegie Mellon's web template, for Cascade sites and for web
apps that use the same template: path cards, numbered
steps, callouts, status pills, tabs, dialogs, file drop zones, bulk
selection bars and more. They fill the gaps in the template without
changing how it looks.

**Documentation and live examples: https://cmutli.github.io/cmu-web-kit/**

## Two Files

* `cmu-cms.css`: page components, for Cascade sites and apps alike
* `cmu-app.css`: app components, added after `cmu-cms.css`

## Add It to a Cascade Site

Add this line to the text block your site's `setup` block puts in the
head, above your site's own stylesheet:

```html
<link href="https://cdn.jsdelivr.net/gh/CMUTLI/cmu-web-kit@0.1.0/css/cmu-cms.css" media="screen" rel="stylesheet" type="text/css"/>
```

Then paste components into a content section's Source code view. The
[Get Started](https://cmutli.github.io/cmu-web-kit/docs/start.html) page
walks through it step by step.

## Add It to an App

```html
<link href="https://cdn.jsdelivr.net/gh/CMUTLI/cmu-web-kit@0.1.0/css/cmu-cms.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/gh/CMUTLI/cmu-web-kit@0.1.0/css/cmu-app.css" rel="stylesheet">
```

Load them after the template's stylesheet and before your own. For an app
in production, keep your own copy of a release instead; the
[Get Started](https://cmutli.github.io/cmu-web-kit/docs/start.html) page
shows how for Node and other stacks.

## Versions

Every link names an exact version, so your pages never change until you
choose to move to a newer one. See the
[releases](https://github.com/CMUTLI/cmu-web-kit/releases) for what each
version changed.

## License

The code and documentation are under the BSD 3-Clause License (see
`LICENSE`), copyright Carnegie Mellon University. It doesn't cover:

* **Carnegie Mellon's names and marks**, including the Scotty image in
  `docs/images/scotty.png` (the Office of Human Resources' Scotty avatar)
  and the Core Competencies logo in `docs/images/core4-logo.png`. The
  license grants no rights to them, and its third clause bars using the
  university's name to endorse or promote work derived from this code.
* **CMU's web template**, which the kit builds on. The university hosts it
  at www.cmu.edu/common/standard-v6; it isn't part of this repository.

## Questions and Requests

Missing a component, or found a problem?
[Open an issue](https://github.com/CMUTLI/cmu-web-kit/issues). To work on
the kit itself, see [CONTRIBUTING.md](CONTRIBUTING.md).
