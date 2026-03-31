import { snapshotRow } from "../ui/shared";

type GeneralDeps = {
  packageVersion: string;
  configPath: string;
  storedBindings: number;
  cachedApps: number;
  activeHotkeys: number;
};

export function renderGeneral({
  packageVersion,
  configPath,
  storedBindings,
  cachedApps,
  activeHotkeys,
}: GeneralDeps) {
  return `
    <section class="content-grid two-column">
      <article class="panel">
        <div class="panel-header"><div><p class="panel-kicker">Configuration</p><h2>General</h2></div></div>
        <div class="snapshot-list">
          ${snapshotRow("badge-info", "App version", packageVersion)}
          ${snapshotRow("folder-open", "Config path", configPath)}
          ${snapshotRow("command", "Stored bindings", String(storedBindings))}
          ${snapshotRow("grid-2x2", "Cached apps", String(cachedApps))}
          ${snapshotRow("keyboard", "Active hotkeys", String(activeHotkeys))}
        </div>
      </article>
      <article class="panel">
        <div class="panel-header"><div><p class="panel-kicker">Tools</p><h2>General tools</h2></div></div>
        <div class="tool-list">
          <button class="tool-row" id="reload-button" type="button">Reload from disk</button>
          <button class="tool-row" id="health-button" type="button">Refresh health</button>
          <button class="tool-row" data-view="spotify" type="button">Open Spotify settings</button>
          <button class="tool-row" data-view="firetv-device" type="button">Open Fire TV settings</button>
        </div>
      </article>
    </section>
  `;
}
