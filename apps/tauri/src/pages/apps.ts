import type { FireTvApp } from "../types";
import { icon } from "../icons";
import { escapeHtml } from "../utils";
import { emptyStateText, snapshotRow, textInput } from "../ui/shared";

type AppsDeps = {
  busy: boolean;
  apps: FireTvApp[];
  fireTvAppFilter: string;
  currentFireTvAppsCount: number;
  favoriteBindingsCount: number;
};

export function renderApps({
  busy,
  apps,
  fireTvAppFilter,
  currentFireTvAppsCount,
  favoriteBindingsCount,
}: AppsDeps) {
  return `
    <section class="content-grid two-column-wide apps-page">
      <article class="panel apps-launcher-panel">
        <div class="panel-header"><div><p class="panel-kicker">Launcher</p><h2>Fire TV Apps</h2><p class="panel-subcopy">Scan, filter, and launch installed apps from your Fire TV.</p></div></div>
        <div class="apps-toolbar">
          <button class="button-primary" id="firetv-scan-apps-button" type="button" ${busy ? "disabled" : ""}>Scan Fire TV apps</button>
          <button class="button-secondary" id="firetv-load-apps-button" type="button" ${busy ? "disabled" : ""}>Load cached apps</button>
        </div>
        <div class="apps-filter-field">
          ${textInput("firetv-app-filter", "Filter apps", fireTvAppFilter, "spotify, netflix, youtube...")}
        </div>
        ${
          apps.length
            ? `<div class="app-list app-launch-list">${apps
                .map(
                  (app) => `<article class="app-launch-row app-launch-row--compact"><div class="app-launch-main"><span class="app-launch-icon">${icon("app-window")}</span><div class="app-launch-copy"><h3>${escapeHtml(app.display_name)}</h3><p>${escapeHtml(app.package_name)}</p></div></div><button class="button-secondary launch-app-button" data-package-name="${escapeHtml(app.package_name)}" type="button" ${busy ? "disabled" : ""}>Launch</button></article>`,
                )
                .join("")}</div>`
            : emptyStateText("No cached apps yet", "Scan Fire TV apps to build your launcher list.")
        }
      </article>
      <article class="panel apps-summary-panel">
        <div class="panel-header"><div><p class="panel-kicker">Summary</p><h2>App cache</h2><p class="panel-subcopy">Quick context for the current launcher view.</p></div></div>
        <div class="snapshot-list">
          ${snapshotRow("grid-2x2", "Cached apps", String(currentFireTvAppsCount))}
          ${snapshotRow("search", "Filter", fireTvAppFilter || "No filter")}
          ${snapshotRow("star", "Favorites", String(favoriteBindingsCount))}
        </div>
      </article>
    </section>
  `;
}
