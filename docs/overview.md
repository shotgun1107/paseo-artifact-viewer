# Artifact Viewer for Paseo

Open an HTML page, SVG drawing or React component made in a conversation. A card opens the selected version beside the chat. The Artifacts library opens it in the main workspace and lets you find results from other conversations on the same daemon.

## How it works

The plugin appends an artifact guide to the stored system instructions of every newly created agent. Removing the plugin leaves that guide in existing agents. In an older conversation, use `/artifact-guide` to give the current agent the instructions. Codex and Claude sessions receive four tools to publish, read, list and open artifacts. Other providers can return supported code blocks, which the plugin extracts.

When a turn ends, and when a conversation is opened and its artifacts are loaded, extraction reads up to the latest 1,000 timeline entries. It saves complete code blocks and eligible file contents from completed write or edit records linked in the same turn. The link itself does not cause a disk read. Older entries are outside the extraction window. Separately, restoring a missing card can page further back to match previously saved card IDs.

## What you need

Use Paseo desktop or web with a compatible daemon. This version targets Paseo 0.16.1 through the 0.17 series and requires a daemon Node runtime with `node:sqlite`. Enable trusted plugins on the daemon. To open a version in a separate browser tab, the browser and daemon must be on the same computer.

## What gets stored and sent

The daemon saves source, version history and card delivery records in local SQLite. The library covers all conversations on that daemon. You can search, pin, rename, duplicate, export or restore an earlier version. Deleting an artifact hides it. Its body remains in the database. Removing the plugin also leaves the database under `$PASEO_HOME/plugin-data/paseo-artifact-viewer/`.

Model-generated HTML and React run in isolated frames. HTML and SVG start with external resources blocked. Documents that reference an external HTTPS address initially show a static preview of their text and basic shapes. If you allow external resources, the document can load scripts, styles, images and fonts from the HTTPS addresses it references. Those servers receive the resource requests. Opening HTML in a separate browser tab also starts offline.

Starting the in-app React preview requires consent and sends the component source to the CodeSandbox bundler. Opening React in a separate browser tab uses a time-limited local URL. With consent, the browser fetches supported libraries from esm.sh and runs the component there. Export writes the chosen version to a file.

## Limits

Previews support a single source file of up to 512,000 characters. The mobile app does not provide the preview or library. If a card repeatedly fails to reach a conversation, it can stop retrying. The delivery failure is recorded in plugin logs and available through a diagnostic RPC. There is no failure list in the UI. The stored artifact remains readable. Back up the SQLite database before changing daemon or plugin versions.
