import type { Activity, AppConfig, SpotifyAuthDebug, SpotifyStatus } from "../types";
import { escapeHtml, timeAgo } from "../utils";
import { emptyStateText, settingsField, spotifyStatusRow } from "../ui/shared";
import { icon } from "../icons";

type SpotifyDeps = {
  busy: boolean;
  currentConfig: AppConfig;
  currentSpotifyStatus: SpotifyStatus | null;
  currentSpotifyDebug: SpotifyAuthDebug | null;
  spotifyAuthUrl: string;
  spotifyCallbackInput: string;
  recentActivity: Activity[];
};

export function renderSpotify({
  busy,
  currentConfig,
  currentSpotifyStatus,
  currentSpotifyDebug,
  spotifyAuthUrl,
  spotifyCallbackInput,
  recentActivity,
}: SpotifyDeps) {
  const authStatus = currentSpotifyStatus?.authenticated ? "Active" : "Missing";
  const targetState = currentSpotifyStatus?.target_name ?? "Not detected";
  const playbackReady = Boolean(currentSpotifyStatus?.authenticated && currentSpotifyStatus?.target_found);
  const activity = recentActivity
    .filter((item) => {
      const text = item.text.toLowerCase();
      return text.includes("spotify") || text.includes("playback") || text.includes("auth") || text.includes("target");
    })
    .slice(0, 4);
  const lastSpotifyActivity = activity[0] ?? null;
  const authTone = currentSpotifyStatus?.authenticated ? "ready" : "error";
  const targetTone = currentSpotifyStatus?.target_found ? "neutral" : "warning";
  const redirectTone = currentConfig.spotify_redirect_url.trim() ? "ready" : "warning";
  const playbackTone = playbackReady ? "ready" : currentSpotifyStatus?.authenticated ? "neutral" : "error";
  const targetStatus = currentSpotifyStatus?.target_found ? targetState : "Missing";
  const playbackStatus = playbackReady ? "Ready" : currentSpotifyStatus?.authenticated ? "Connected" : "Missing";

  return `
    <section class="spotify-page">
      <article class="panel spotify-session-panel spotify-session-panel--primary">
        <div class="spotify-session-shell">
          <div class="spotify-session-controls">
            <div class="spotify-action-bar">
              <button class="button-primary" id="spotify-toggle-button" type="button" ${busy ? "disabled" : ""}>Toggle playback</button>
              <button class="button-secondary" id="spotify-transfer-button" type="button" ${busy ? "disabled" : ""}>Transfer to TV</button>
              <button class="button-secondary" id="spotify-status-button" type="button" ${busy ? "disabled" : ""}>Refresh</button>
              ${currentSpotifyStatus?.authenticated ? "" : `<button class="button-secondary" id="spotify-start-auth-button" type="button" ${busy ? "disabled" : ""}>Authenticate</button>`}
            </div>
          </div>
          <div class="spotify-session-state">
            <div class="spotify-status-list">
              ${spotifyStatusRow("Playback", playbackStatus, "play", playbackTone)}
              ${spotifyStatusRow("Target", targetStatus, "tv", targetTone)}
              ${spotifyStatusRow("Authentication", authStatus, "key-round", authTone)}
            </div>
          </div>
        </div>
        <div class="spotify-last-action">
          <span class="spotify-last-action-label">${icon("history")}<span>${escapeHtml(lastSpotifyActivity ? `Last action: ${lastSpotifyActivity.text} (${timeAgo(lastSpotifyActivity.at)})` : "Last action: No recent activity")}</span></span>
        </div>
      </article>

      <article class="panel spotify-activity-panel">
        <div class="panel-header"><div><p class="panel-kicker">Activity</p><h2>Recent Spotify activity</h2></div></div>
        ${
          activity.length
            ? `<div class="activity-list">${activity
                .map(
                  (item) => `<article class="activity-item ${item.tone}"><div><h3>${escapeHtml(item.text)}</h3><p>${escapeHtml(timeAgo(item.at))}</p></div></article>`,
                )
                .join("")}</div>`
            : emptyStateText("No recent Spotify activity", "Authentication, target detection, and playback actions will appear here.")
        }
      </article>

      <article class="panel spotify-settings-panel">
        <details class="spotify-secondary-block">
          <summary>
            <span>
              <p class="panel-kicker">Settings</p>
              <h2>Spotify settings</h2>
            </span>
            <span class="mini-tag ${redirectTone}">${escapeHtml(currentConfig.spotify_redirect_url.trim() ? "Configured" : "Needs setup")}</span>
          </summary>
          <form class="spotify-settings-form" id="spotify-settings-form">
            ${settingsField("spotify-client-id", "Client ID", currentConfig.spotify_client_id, "your-client-id")}
            ${settingsField("spotify-client-secret", "Client secret", currentConfig.spotify_client_secret, "your-client-secret")}
            ${settingsField("spotify-redirect-url", "Redirect URL", currentConfig.spotify_redirect_url, "http://127.0.0.1:8888/callback")}
            ${settingsField("spotify-target-hints", "Target hints", currentConfig.spotify_target_hints, "fire, tv, amazon")}
            <div class="spotify-form-footer">
              <p class="meta">Stored locally for Spotify Connect authentication and target matching.</p>
              <div class="actions">
                <button class="button-primary" id="save-spotify-settings-button" type="submit" ${busy ? "disabled" : ""}>Save settings</button>
              </div>
            </div>
          </form>
        </details>
      </article>

      <article class="panel spotify-advanced-panel">
        <details class="spotify-secondary-block">
          <summary>
            <span>
              <p class="panel-kicker">Advanced</p>
              <h2>Diagnostics and manual tools</h2>
            </span>
            <span class="mini-tag">Optional</span>
          </summary>
          <div class="spotify-settings-stack">
            ${settingsField("spotify-auth-url", "Authorization URL", spotifyAuthUrl, "Generated after auth", { readOnly: true, mono: true })}
          </div>
          <p class="meta">${escapeHtml(currentSpotifyDebug?.detail ?? "Auth diagnostics will appear here after inspection.")}</p>
          <div class="spotify-inline-tools">
            <button class="button-secondary" id="spotify-debug-button" type="button" ${busy ? "disabled" : ""}>Inspect auth</button>
          </div>
          <details class="detail-block spotify-detail-block">
            <summary>Manual callback fallback</summary>
            <div class="spotify-settings-stack">
              ${settingsField("spotify-callback-input", "Callback URL or code", spotifyCallbackInput, "Paste callback URL or code")}
            </div>
            <div class="actions"><button class="button-secondary" id="spotify-finish-auth-button" type="button" ${busy ? "disabled" : ""}>Finish manually</button></div>
          </details>
        </details>
      </article>
    </section>
  `;
}
