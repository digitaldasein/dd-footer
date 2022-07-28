<!--
SPDX-FileCopyrightText: 2022 Digital Dasein <https://digital-dasein.gitlab.io/>
SPDX-FileCopyrightText: 2022 Gerben Peeters <gerben@digitaldasein.org>
SPDX-FileCopyrightText: 2022 Senne Van Baelen <senne@digitaldasein.org>

SPDX-License-Identifier: MIT
-->

# \<dd-footer>

![pipeline](https://gitlab.com/digital-dasein/software/javascript/compono/badges/main/pipeline.svg?job=build_dd_footer&key_text=build)
![coverage](https://gitlab.com/digital-dasein/software/javascript/compono/badges/main/coverage.svg?job=test_dd_footer)

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation

```bash
yarn add @compono/dd-footer
```
or

```bash
npm i @compono/dd-footer
```

## Usage

```html
<script type="module">
  import 'path/to/dd-footer.js';
</script>

<dd-footer></dd-footer>
```

## Local Demo with `web-dev-server`

```bash
yarn start
```

To run a local development server that serves the basic demo located in 
`demo/index.html`

## Linting and formatting

To scan the project for linting and formatting errors, run

```bash
yarn lint
```

To automatically fix linting and formatting errors, run

```bash
yarn format
```

## Testing with Web Test Runner

To execute a single test run:

```bash
yarn test
```

To run the tests in interactive watch mode run:

```bash
yarn test:watch
```


## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to 
individual files.
