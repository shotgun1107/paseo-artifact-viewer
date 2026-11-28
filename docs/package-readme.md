# Paseo Artifact Viewer

Preview HTML, SVG, and React artifacts beside a Paseo conversation. Click an artifact card to open that version, or choose **Artifacts** in the sidebar to search the daemon's library.

Use `/artifact-guide` in a conversation that predates installation. Use `/artifact` to open the library. From the viewer, you can pin an artifact, export its source, or restore an earlier version as a new revision.

## Requirements and data

This release supports Paseo hosts from 0.16.1 through 0.17.x with trusted plugins enabled and a daemon Node runtime that supports SQLite. See the [English overview](OVERVIEW.md) or [한국어 안내](OVERVIEW.ko.md) for platform limits, stored data, and external services.

The database is at `$PASEO_HOME/plugin-data/paseo-artifact-viewer/artifacts.sqlite`. Use SQLite's online backup facility or stop the daemon before copying the database. Restoring an older backup rolls back artifact changes made since that backup.

## Source and license

The source and contribution instructions are on [GitHub](https://github.com/shotgun1107/paseo-artifact-viewer). See the [MIT license](LICENSE), [third-party notices](THIRD_PARTY_NOTICES.md), and [bundled dependency licenses](THIRD_PARTY_LICENSES.txt).
