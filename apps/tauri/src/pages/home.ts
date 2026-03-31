import { icon } from "../icons";
import type { Activity, Binding, Issue } from "../types";
import { escapeHtml, timeAgo } from "../utils";
import type { ReadinessRow } from "../features/status";
import { emptyState, emptyStateText, renderReadinessAction, snapshotRow, toolRow } from "../ui/shared";

type HomeDeps = {
  busy: boolean;
  issues: Issue[];
  currentConfigFireTvIp: string;
  currentFireTvConnected: boolean;
  currentFireTvScreenAwake: boolean | null | undefined;
  currentSpotifyTargetName: string | null | undefined;
  currentFireTvAppsCount: number;
  favorites: Binding[];
  hotkeys: Binding[];
  recentActivity: Activity[];
  draggedFavoriteId: string;
  dragOverFavoriteId: string;
  bindingIcon: (binding: Binding["action"]) => string;
  describeBindingAction: (binding: Binding["action"]) => string;
  readinessRows: ReadinessRow[];
  screenLabel: (value: boolean | null | undefined) => string;
};

export function renderHome({
  busy,
  issues,
  currentConfigFireTvIp,
  currentFireTvConnected,
  currentFireTvScreenAwake,
  currentSpotifyTargetName,
  currentFireTvAppsCount,
  favorites,
  hotkeys,
  recentActivity,
  draggedFavoriteId,
  dragOverFavoriteId,
  bindingIcon,
  describeBindingAction,
  readinessRows,
  screenLabel,
}: HomeDeps) {
  return `
    <section class="home-grid">
      <section class="home-main">
        <article class="panel">
          <div class="panel-header"><div><p class="panel-kicker">Favorites</p><h2>Quick Access</h2></div><button class="link-button" data-view="quick-access" type="button">Manage</button></div>
          ${
            favorites.length
              ? `<div class="quick-grid">${favorites
                  .slice(0, 6)
                  .map(
                    (binding) => `<button class="quick-tile execute-binding-button ${draggedFavoriteId === binding.id ? "is-dragging" : ""} ${dragOverFavoriteId === binding.id ? "is-drop-target" : ""}" data-binding-id="${escapeHtml(binding.id)}" data-tooltip="${escapeHtml(describeBindingAction(binding.action))}" type="button" ${busy ? "disabled" : ""}><span class="quick-drag-handle" aria-hidden="true">${icon("grip")}</span><span class="quick-icon">${icon(bindingIcon(binding.action))}</span><span>${escapeHtml(binding.label)}</span></button>`,
                  )
                  .join("")}</div>`
              : emptyState("No quick actions yet", "Mark bindings as favorites to pin them here.", "quick-access", "Open Quick Access")
          }
        </article>
        <article class="panel">
          <div class="panel-header"><div><p class="panel-kicker">Keyboard</p><h2>Shortcuts</h2></div><button class="link-button" data-view="hotkeys" type="button">Manage hotkeys</button></div>
          ${
            hotkeys.length
              ? `<div class="shortcut-list">${hotkeys
                  .map(
                    (binding) => `<article class="shortcut-row"><div class="shortcut-copy"><span class="shortcut-icon">${icon(bindingIcon(binding.action))}</span><div><h3>${escapeHtml(binding.label)}</h3><p>${escapeHtml(describeBindingAction(binding.action))}</p></div></div><kbd>${escapeHtml(binding.hotkey)}</kbd></article>`,
                  )
                  .join("")}</div>`
              : emptyState("No hotkeys configured", "Add a hotkey to any binding and it will appear here.", "hotkeys", "Open Hotkeys")
          }
        </article>
        <article class="panel">
          <div class="panel-header"><div><p class="panel-kicker">Recent</p><h2>Recent activity</h2></div></div>
          ${
            recentActivity.length
              ? `<div class="activity-list">${recentActivity
                  .slice(0, 5)
                  .map(
                    (item) => `<article class="activity-item ${item.tone}"><div><h3>${escapeHtml(item.text)}</h3><p>${escapeHtml(timeAgo(item.at))}</p></div></article>`,
                  )
                  .join("")}</div>`
              : emptyStateText("No recent activity", "Recent actions and issues will show up here.")
          }
        </article>
      </section>
      <aside class="home-side">
        <button class="panel hero-panel action-tile" id="start-spotify-on-tv-button" type="button" ${busy ? "disabled" : ""}>
          <div class="hero-top">
            <div>
              <p class="panel-kicker">Main flow</p>
              <h2>Spotify on TV</h2>
            </div>
            <span class="status-chip ${issues.length ? "is-warning" : "is-ready"}">${escapeHtml(issues.length ? issues[0].title : "Ready")}</span>
          </div>
          <div class="action-tile-body">
            <span class="action-tile-icon">${icon("music-4")}</span>
            <div class="action-tile-copy">
              <strong>Start Spotify on TV</strong>
              <p>Wake the TV, launch Spotify, and transfer playback.</p>
            </div>
          </div>
        </button>
        <article class="panel utility-panel">
          <div class="panel-header"><div><p class="panel-kicker">Readiness</p><h2>System status</h2></div></div>
          <div class="readiness-list">${readinessRows
            .map(
              (row) => `<article class="readiness-row ${row.tone}"><div class="readiness-copy"><div class="readiness-heading"><span class="readiness-dot ${row.tone}"></span><h3>${escapeHtml(row.label)}</h3></div><p>${escapeHtml(row.detail)}</p>${row.action ? `<div class="readiness-inline-actions">${renderReadinessAction(row.action)}</div>` : ""}</div><div class="readiness-side"><span class="mini-tag ${row.tone}">${escapeHtml(row.status)}</span></div></article>`,
            )
            .join("")}</div>
        </article>
        <article class="panel utility-panel">
          <div class="panel-header"><div><p class="panel-kicker">Snapshot</p><h2>Device snapshot</h2></div></div>
          <div class="snapshot-list">
            ${snapshotRow("tv", "Fire TV", currentConfigFireTvIp || "Not configured")}
            ${snapshotRow("plug-zap", "Connection", currentFireTvConnected ? "Connected" : "Offline")}
            ${snapshotRow("monitor-up", "Screen", screenLabel(currentFireTvScreenAwake))}
            ${snapshotRow("music-4", "Spotify target", currentSpotifyTargetName ?? "Not detected")}
            ${snapshotRow("grid-2x2", "Cached apps", String(currentFireTvAppsCount))}
            ${snapshotRow("keyboard", "Active hotkeys", String(hotkeys.length))}
          </div>
        </article>
        <article class="panel utility-panel">
          <div class="panel-header"><div><p class="panel-kicker">Tools</p><h2>Quick tools</h2></div></div>
          <div class="tool-list">
            ${toolRow("grid-2x2", "Apps", "Browse and launch cached TV apps", "apps")}
            ${toolRow("gamepad-2", "Remote", "Open manual TV controls", "remote")}
            ${toolRow("activity", "Diagnostics", "Review system readiness and checks", "health")}
            ${toolRow("settings-2", "Settings", "Open Spotify and Fire TV configuration", "general")}
          </div>
        </article>
      </aside>
    </section>
  `;
}
