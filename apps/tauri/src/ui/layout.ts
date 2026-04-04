import sendoLogoUrl from "../assets/sendo.svg";
import type { Issue, ViewId } from "../types";
import { escapeHtml } from "../utils";
import { issuePopover, navButton, navGroup } from "./shared";

type LayoutDeps = {
  currentView: ViewId;
  openGroups: Set<string>;
  issues: Issue[];
  issuesOpen: boolean;
  sidebarIndicatorTop: number;
  sidebarIndicatorLeft: number;
  sidebarIndicatorVisible: boolean;
  packageVersion: string;
  sectionLabel: string;
  title: string;
  flashMessage: string;
  flashIsError: boolean;
  viewHtml: string;
};

export function renderAppShell({
  currentView,
  openGroups,
  issues,
  issuesOpen,
  sidebarIndicatorTop,
  sidebarIndicatorLeft,
  sidebarIndicatorVisible,
  packageVersion,
  sectionLabel,
  title,
  flashMessage,
  flashIsError,
  viewHtml,
}: LayoutDeps) {
  return `
    <main class="desk-shell">
      <aside class="sidebar">
        <div class="sidebar-top">
          <div class="sidebar-brand">
            <img class="brand-mark" src="${sendoLogoUrl}" alt="Sendo" />
            <div><strong>Sendo</strong><p>Media control utility</p></div>
          </div>
          <nav class="sidebar-nav">
            <span class="nav-active-indicator" aria-hidden="true" style="top:${sidebarIndicatorTop}px;left:${sidebarIndicatorLeft}px;opacity:${sidebarIndicatorVisible ? "1" : "0"};"></span>
            ${navButton(currentView, "home", "Home", "house")}
            ${navGroup(currentView, openGroups, "playback", "Playback", [["spotify", "Spotify", "music-4"], ["quick-access", "Quick Access", "sparkles"], ["hotkeys", "Hotkeys", "keyboard"]])}
            ${navGroup(currentView, openGroups, "firetv", "Fire TV", [["firetv-device", "ADB & Device", "tv"], ["apps", "Apps", "grid-2x2"], ["remote", "Remote", "gamepad-2"]])}
            ${navGroup(currentView, openGroups, "system", "System", [["health", "Health", "activity"], ["general", "General", "settings-2"]])}
          </nav>
        </div>
        <div class="sidebar-footer">
          <p>v${escapeHtml(packageVersion)}</p>
        </div>
      </aside>
      <section class="workspace">
        <header class="topbar">
          <div><p>${escapeHtml(sectionLabel)}</p><h1>${escapeHtml(title)}</h1></div>
          <div class="topbar-actions">
            <span class="pill">v${escapeHtml(packageVersion)}</span>
            <div class="issues-anchor">
              <button class="pill ${issues.length ? "is-warning" : "is-ready"}" id="issues-button" type="button">${issues.length} ${issues.length === 1 ? "issue" : "issues"}</button>
              ${issuesOpen ? issuePopover(issues) : ""}
            </div>
          </div>
        </header>
        ${flashMessage ? `<div class="flash-banner ${flashIsError ? "is-error" : ""}" role="status" aria-live="polite">${escapeHtml(flashMessage)}</div>` : ""}
        <section class="view-shell">${viewHtml}</section>
      </section>
    </main>
  `;
}
