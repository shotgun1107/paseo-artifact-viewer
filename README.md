# Paseo Artifact Viewer

Preview HTML, SVG and React artifacts beside a Paseo conversation, keep their revision history on the daemon, and browse them in the Artifacts library. For data access, external services and limitations, read the [English overview](OVERVIEW.md) or [한국어 소개](OVERVIEW.ko.md).

## Install in Paseo

With trusted plugins enabled on your Paseo daemon, install the prebuilt release:

```sh
paseo plugin add git:shotgun1107/paseo-artifact-viewer --ref v0.9.3
```

The release tag contains the runnable plugin and its bundled dependencies. The default branch contains the development source. For a manual installation, download the [0.9.3 release archive](https://github.com/shotgun1107/paseo-artifact-viewer/releases/tag/v0.9.3), extract it, and install the extracted `package` directory.

## Use the viewer

Ask your agent to create an artifact. A completed publish produces a card under the reply. Click it to open that version beside the conversation. Select **Artifacts** in the sidebar to search the daemon-wide library. Opening a result there fills the main workspace. Back and Forward navigate between the result and the library.

Use `/artifact-guide` in a conversation that predates installation. `/artifact` opens the library. With a description, the command asks the current agent to make the artifact. Pin a result, export its source or restore an earlier version from the viewer. Restoring saves a new revision.

## Build and verify

Use Node with built-in SQLite support and the versions recorded in the lockfile. The supported Paseo host range is `>=0.16.1 <0.18.0`.

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run typecheck
npm test
npm run build
npm run verify:package
npm run test:browser:package
```

Set `ARTIFACT_TEST_BROWSER` to a Chromium or Edge executable when the browser harness cannot find one. The build creates a distribution directory and a tarball with the client and server entries, listing media, documentation and license texts. The source package is private. Release checks should use the generated tarball.

## Back up local data

The daemon keeps its database at `$PASEO_HOME/plugin-data/paseo-artifact-viewer/artifacts.sqlite`. Use SQLite's online backup facility, or stop the daemon before making a filesystem backup. A live database can have committed changes in its WAL file. Keep a consistent backup and the previous plugin version before upgrading. Restoring an older snapshot also rolls back artifact changes made after the snapshot.

## License

This plugin is distributed under the [MIT license](LICENSE). See the [third-party notices](THIRD_PARTY_NOTICES.md) for design references, bundled components and font licensing. The distribution also includes the full dependency licenses in `THIRD_PARTY_LICENSES.txt`.
