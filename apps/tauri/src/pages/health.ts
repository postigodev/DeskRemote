import type { FireTvStatus, HealthStatus, Issue, SpotifyStatus } from "../types";
import { emptyStateText, snapshotRow } from "../ui/shared";
import { escapeHtml } from "../utils";

type HealthDeps = {
  busy: boolean;
  issues: Issue[];
  currentHealth: HealthStatus | null;
  currentFireTvStatus: FireTvStatus | null;
  currentSpotifyStatus: SpotifyStatus | null;
};

export function renderHealth({
  busy,
  issues,
  currentHealth,
  currentFireTvStatus,
  currentSpotifyStatus,
}: HealthDeps) {
  return `
    <section class="content-grid two-column">
      <article class="panel">
        <div class="panel-header"><div><p class="panel-kicker">Readiness</p><h2>Health</h2></div><button class="button-secondary" id="health-button" type="button" ${busy ? "disabled" : ""}>Refresh health</button></div>
        ${
          issues.length
            ? `<div class="issue-list">${issues
                .map(
                  (issue) => `<article class="issue-item ${issue.tone}"><div><h3>${escapeHtml(issue.title)}</h3><p>${escapeHtml(issue.detail)}</p></div><button class="link-button" data-view="${issue.view}" type="button">${escapeHtml(issue.actionLabel)}</button></article>`,
                )
                .join("")}</div>`
            : emptyStateText("No current blockers", "The system is ready for Spotify on TV.")
        }
      </article>
      <article class="panel">
        <div class="panel-header"><div><p class="panel-kicker">Checks</p><h2>Technical summary</h2></div></div>
        <div class="snapshot-list">
          ${snapshotRow("folder-open", "Config path", currentHealth?.config_path ?? "Unavailable")}
          ${snapshotRow("tv", "Fire TV summary", currentHealth?.firetv_summary ?? "Unavailable")}
          ${snapshotRow("music-4", "Spotify summary", currentHealth?.spotify_summary ?? "Unavailable")}
          ${snapshotRow("activity", "Fire TV status", currentFireTvStatus?.summary ?? "Unavailable")}
          ${snapshotRow("activity", "Spotify status", currentSpotifyStatus?.summary ?? "Unavailable")}
        </div>
      </article>
    </section>
  `;
}
