# Contributing

Issues and pull requests are welcome on [github.com/EhsanCh/js-modern-datepicker](https://github.com/EhsanCh/js-modern-datepicker).

1. Open an issue to discuss larger changes.
2. Fork the repository and create a branch from `main`.
3. Run `npm install`, then `npm run checkAll` before opening a PR (`build`, Prettier, tests, size limit).
4. Keep changes focused; match existing code style in `src/`.

Thank you for helping improve the project.

## Releases

Releases are published to npm automatically from [`.github/workflows/publish.yml`](.github/workflows/publish.yml) when a **GitHub Release** is published (Trusted Publisher / OIDC — no `NPM_TOKEN`).

1. Bump `version` in `package.json` and commit on `main`.
2. Create and push an annotated tag: `git tag vX.Y.Z && git push origin vX.Y.Z` (tag must match `package.json`, with a `v` prefix).
3. On GitHub: **Releases → Draft a new release** → choose the tag → **Publish release**.

Before the first automated publish, create the package on npm and add a Trusted Publisher for workflow file `publish.yml` and repository `EhsanCh/js-modern-datepicker`. See [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/).

## GitHub Pages demo

The interactive demo is deployed from the `demo/` directory by [`.github/workflows/pages.yml`](.github/workflows/pages.yml). In the repository **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions**. After the first successful run, the site is available at `https://<github-username>.github.io/js-modern-datepicker/`.

The demo source is `demo/main.js` (bundled to `demo/app.js` via `npm run demo:build`). It showcases `createInputDatePicker`, inline `createDatePicker`, and Jalali locale — keep it in sync when adding public APIs.

Public API documentation lives in [`docs/API.md`](docs/API.md); update it when changing options or exports.
