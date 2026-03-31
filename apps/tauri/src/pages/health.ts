import { icon } from "../icons";
import type { ReadinessRow } from "../features/status";
import type { FireTvStatus, HealthStatus, Issue, SpotifyStatus } from "../types";
import { renderReadinessAction, toolRow } from "../ui/shared";
import { escapeHtml } from "../utils";

type HealthDeps = {
  busy: boolean;
  issues: Issue[];
  readinessRows: ReadinessRow[];
  currentHealth: HealthStatus | null;
  currentFireTvStatus: FireTvStatus | null;
  currentSpotifyStatus: SpotifyStatus | null;
};

export function renderHealth({
  busy,
  issues,
  readinessRows,
  currentHealth,
  currentFireTvStatus,
  currentSpotifyStatus,
}: HealthDeps) {
  return `
    <section class="content-grid two-column">
      <article class="panel health-readiness-panel">
        <div class="panel-header">
          <div>
            <p class="panel-kicker">Readiness</p>
            <h2>System readiness</h2>
            <p class="panel-subcopy">Live checks for the Fire TV connection, Spotify authentication, and target availability.</p>
          </div>
          <button class="button-secondary" id="health-refresh-button" type="button" ${busy ? "disabled" : ""}>Refresh health</button>
        </div>
        <div class="health-status-banner ${issues.length ? "is-warning" : "is-ready"}">
          <span class="health-status-icon">${icon(issues.length ? "triangle-alert" : "circle-check-big")}</span>
          <div>
            <strong>${escapeHtml(issues.length ? `${issues.length} issue${issues.length === 1 ? "" : "s"} need attention` : "All systems ready")}</strong>
            <p>${escapeHtml(issues.length ? "The checks below show what is currently blocking or degraded." : "Desk Remote is ready for Spotify on TV.")}</p>
          </div>
        </div>
        <div class="readiness-list">${readinessRows.map((row) => `<article class="readiness-row ${row.tone}"><div class="readiness-copy"><div class="readiness-heading"><span class="readiness-dot ${row.tone}"></span><h3>${escapeHtml(row.label)}</h3></div><p>${escapeHtml(row.detail)}</p>${row.action ? `<div class="readiness-inline-actions">${renderReadinessAction(row.action)}</div>` : ""}</div><div class="readiness-side"><span class="mini-tag ${row.tone}">${escapeHtml(row.status)}</span></div></article>`).join("")}</div>
      </article>
      <aside class="health-side-stack">
        <article class="panel health-technical-panel">
          <div class="panel-header">
            <div>
              <p class="panel-kicker">Checks</p>
              <h2>Technical summary</h2>
              <p class="panel-subcopy">Useful internal summaries when a check is failing or behaving unexpectedly.</p>
            </div>
          </div>
          <div class="health-summary-list">
            <article class="health-summary-row">
              <div class="health-summary-copy">
                <span class="health-summary-label">${icon("folder-open")}<span>Config path</span></span>
                <p>${escapeHtml(currentHealth?.config_path ?? "Unavailable")}</p>
              </div>
            </article>
            <article class="health-summary-row">
              <div class="health-summary-copy">
                <span class="health-summary-label">${icon("tv")}<span>Fire TV summary</span></span>
                <p>${escapeHtml(currentHealth?.firetv_summary ?? "Unavailable")}</p>
              </div>
            </article>
            <article class="health-summary-row">
              <div class="health-summary-copy">
                <span class="health-summary-label">${icon("music-4")}<span>Spotify summary</span></span>
                <p>${escapeHtml(currentHealth?.spotify_summary ?? "Unavailable")}</p>
              </div>
            </article>
            <article class="health-summary-row">
              <div class="health-summary-copy">
                <span class="health-summary-label">${icon("activity")}<span>Fire TV status</span></span>
                <p>${escapeHtml(currentFireTvStatus?.summary ?? "Unavailable")}</p>
              </div>
            </article>
            <article class="health-summary-row">
              <div class="health-summary-copy">
                <span class="health-summary-label">${icon("activity")}<span>Spotify status</span></span>
                <p>${escapeHtml(currentSpotifyStatus?.summary ?? "Unavailable")}</p>
              </div>
            </article>
          </div>
        </article>
        <article class="panel health-recovery-panel">
          <div class="panel-header">
            <div>
              <p class="panel-kicker">Recovery</p>
              <h2>Quick recovery</h2>
              <p class="panel-subcopy">Jump straight to the pages and actions most likely to unblock playback.</p>
            </div>
          </div>
          <div class="tool-list">
            <button class="tool-row" id="health-refresh-recovery-button" type="button" ${busy ? "disabled" : ""}>
              <span class="tool-row-copy"><span class="tool-row-icon">${icon("refresh-cw")}</span><span class="tool-row-text"><strong>Refresh health</strong><span>Run the latest system checks again.</span></span></span>
              <span class="tool-row-chevron">${icon("chevron-right")}</span>
            </button>
            ${toolRow("music-4", "Open Spotify", "Check authentication, target hints, and playback state.", "spotify")}
            ${toolRow("tv", "Open Fire TV", "Review device address, connection, and power controls.", "firetv-device")}
            ${toolRow("settings-2", "Open General", "Reload local data and review app-level information.", "general")}
          </div>
        </article>
      </aside>
    </section>
  `;
}
