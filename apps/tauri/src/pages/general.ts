import { icon } from "../icons";
import { snapshotRow, toolRow } from "../ui/shared";

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
    <section class="content-grid two-column general-page">
      <article class="panel general-overview-panel">
        <div class="panel-header">
          <div>
            <p class="panel-kicker">Overview</p>
            <h2>Desk Remote</h2>
            <p class="panel-subcopy">Application info, local storage, and quick counts for the current setup.</p>
          </div>
        </div>
        <div class="general-overview-stack">
          <section class="general-overview-block">
            <div class="general-overview-header">
              <h3>Application</h3>
            </div>
            <div class="snapshot-list">
              ${snapshotRow("badge-info", "App version", packageVersion)}
              ${snapshotRow("folder-open", "Config path", configPath)}
            </div>
          </section>
          <section class="general-overview-block">
            <div class="general-overview-header">
              <h3>Current totals</h3>
            </div>
            <div class="general-stat-grid">
              <article class="general-stat-card">
                <span class="general-stat-icon">${icon("command")}</span>
                <div>
                  <p>Stored bindings</p>
                  <strong>${storedBindings}</strong>
                </div>
              </article>
              <article class="general-stat-card">
                <span class="general-stat-icon">${icon("grid-2x2")}</span>
                <div>
                  <p>Cached apps</p>
                  <strong>${cachedApps}</strong>
                </div>
              </article>
              <article class="general-stat-card">
                <span class="general-stat-icon">${icon("keyboard")}</span>
                <div>
                  <p>Active hotkeys</p>
                  <strong>${activeHotkeys}</strong>
                </div>
              </article>
            </div>
          </section>
        </div>
      </article>
      <article class="panel general-tools-panel">
        <div class="panel-header">
          <div>
            <p class="panel-kicker">Maintenance</p>
            <h2>General tools</h2>
            <p class="panel-subcopy">Reload the app state or jump to the main setup pages.</p>
          </div>
        </div>
        <div class="tool-list">
          <button class="tool-row" id="reload-button" type="button">
            <span class="tool-row-copy"><span class="tool-row-icon">${icon("refresh-cw")}</span><span class="tool-row-text"><strong>Reload from disk</strong><span>Re-read local configuration, app cache, and bindings.</span></span></span>
            <span class="tool-row-chevron">${icon("chevron-right")}</span>
          </button>
          <button class="tool-row" id="health-button" type="button">
            <span class="tool-row-copy"><span class="tool-row-icon">${icon("activity")}</span><span class="tool-row-text"><strong>Refresh health</strong><span>Run the latest readiness and system checks.</span></span></span>
            <span class="tool-row-chevron">${icon("chevron-right")}</span>
          </button>
          ${toolRow("music-4", "Spotify settings", "Open Spotify auth, target, and playback tools.", "spotify")}
          ${toolRow("tv", "Fire TV settings", "Open device address, connection, and power controls.", "firetv-device")}
        </div>
      </article>
    </section>
  `;
}
