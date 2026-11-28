# Contributing

For a bug report, include the plugin and Paseo versions, the operating system, and the steps to reproduce it with sample data. Keep private conversations, artifact contents, and daemon logs with personal information out of public issues.

## Repository layout

- `src/client/` — Paseo contributions, the editor, and previews.
- `src/server/` — daemon hooks, persistence, and local web previews.
- `src/shared/` — contracts and helpers used by both sides.
- `test/` — unit, integration, and browser tests using local fixtures.
- `scripts/` — build, package verification, and screenshot capture.
- `docs/` and `media/` — user documentation, licensing notices, and screenshots.

Paseo discovers `index.client.tsx` and `index.server.ts` at the source root. The build produces bundled versions of both entries.

## Run the checks

Use Node.js 24 and the dependencies in the npm lockfile.

~~~sh
npm ci --ignore-scripts --no-audit --no-fund
npm run typecheck
npm test
npm run build
npm run verify:package
~~~

For the browser tests, install the Chromium revision selected by Playwright or set `ARTIFACT_TEST_BROWSER` to an existing Chromium or Edge executable.

~~~sh
npx playwright-core install chromium
npm run test:browser
npm run test:browser:package
~~~

A normal clone writes the installable folder and tarball to `dist/<version>/`. The package build checks its contents against a fixed file list. Keep generated bundles and private runtime data out of pull requests. Use small changes and include a regression test when fixing behavior.

To recreate an existing release, check out its source tag, for example `source-v0.9.3`, before building.
