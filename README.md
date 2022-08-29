<!--
SPDX-FileCopyrightText: 2022 Digital Dasein <https://digitaldasein.org/>
SPDX-FileCopyrightText: 2022 Gerben Peeters <gerben@digitaldasein.org>
SPDX-FileCopyrightText: 2022 Senne Van Baelen <senne@digitaldasein.org>

SPDX-License-Identifier: MIT
-->

# \<dd-footer>

[![pipeline](https://github.com/digitaldasein/dd-footer/actions/workflows/build.yml/badge.svg)](https://github.com/digitaldasein/dd-footer/actions/workflows/build.yml)
[![tests](https://github.com/digitaldasein/dd-footer/actions/workflows/test.yml/badge.svg)](https://digitaldasein.github.io/dd-footer/coverage/lcov-report)
[![REUSE 
status](https://api.reuse.software/badge/github.com/digitaldasein/dd-footer)](https://api.reuse.software/info/github.com/digitaldasein/dd-footer)

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation

```bash
yarn add @digitaldasein/dd-footer
```
or

```bash
npm i @digitaldasein/dd-footer
```

## Usage

As a module:

```html
<script type="module">
  import 'path/to/dd-footer.js';
</script>

<dd-footer>...</dd-footer>
```

For a production-ready build, either integrated into a library or standalone, 
check out the
[libcompono](https://github.com/digitaldasein/libcompono) library.

## Docs

&rarr; [go to 
docs](https://digitaldasein.github.io/dd-footer/docs/classes/DdFooter.html)
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

Test results are available 
[here](https://digitaldasein.github.io/dd-footer/coverage/lcov-report).


## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to 
individual files.
