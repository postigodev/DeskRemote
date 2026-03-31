import type { FireTvApp } from "../types";
import { escapeHtml } from "../utils";
import { emptyStateText, metric, textInput } from "../ui/shared";

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
    <section class="content-grid two-column-wide">
      <article class="panel">
        <div class="panel-header"><div><p class="panel-kicker">Launcher</p><h2>Fire TV Apps</h2></div></div>
        <div class="actions">
          <button class="button-primary" id="firetv-scan-apps-button" type="button" ${busy ? "disabled" : ""}>Scan Fire TV apps</button>
          <button class="button-secondary" id="firetv-load-apps-button" type="button" ${busy ? "disabled" : ""}>Load cached apps</button>
        </div>
        ${textInput("firetv-app-filter", "Filter apps", fireTvAppFilter, "spotify, netflix, youtube...")}
        ${
          apps.length
            ? `<div class="app-list">${apps
                .map(
                  (app) => `<article class="app-launch-row"><div><h3>${escapeHtml(app.display_name)}</h3><p>${escapeHtml(app.package_name)}</p></div><button class="button-secondary launch-app-button" data-package-name="${escapeHtml(app.package_name)}" type="button" ${busy ? "disabled" : ""}>Launch</button></article>`,
                )
                .join("")}</div>`
            : emptyStateText("No cached apps yet", "Scan Fire TV apps to build your launcher list.")
        }
      </article>
      <article class="panel"><div class="panel-header"><div><p class="panel-kicker">Summary</p><h2>App cache</h2></div></div><div class="metric-grid">${metric("Cached apps", String(currentFireTvAppsCount))}${metric("Filter", fireTvAppFilter || "No filter")}${metric("Favorites", String(favoriteBindingsCount))}</div></article>
    </section>
  `;
}
