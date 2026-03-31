import { icon } from "../icons";
import type { Issue, ViewId } from "../types";
import { escapeHtml } from "../utils";
import type { ReadinessAction } from "../features/status";

export function textInput(id: string, label: string, value: string, placeholder: string, readOnly = false) {
  return `<label><span>${escapeHtml(label)}</span><input id="${id}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" ${readOnly ? "readonly" : ""} /></label>`;
}

export function settingsField(
  id: string,
  label: string,
  value: string,
  placeholder: string,
  options?: { readOnly?: boolean; mono?: boolean },
) {
  return `<label class="settings-field"><span class="settings-label">${escapeHtml(label)}</span><input class="settings-input ${options?.mono ? "is-mono" : ""}" id="${id}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" ${options?.readOnly ? "readonly" : ""} /></label>`;
}

export function metric(label: string, value: string, iconName = "circle") {
  return `<article class="metric-card"><div class="metric-label">${icon(iconName)}<p>${escapeHtml(label)}</p></div><h3>${escapeHtml(value)}</h3></article>`;
}

export function spotifyStatusRow(
  label: string,
  value: string,
  iconName: string,
  tone: "ready" | "warning" | "error" | "neutral",
) {
  const showBadge = tone === "warning" || tone === "error";
  return `<article class="spotify-status-row ${tone}"><div class="spotify-status-leading"><span class="spotify-status-icon">${icon(iconName)}</span><h3>${escapeHtml(label)}</h3></div><div class="spotify-status-side"><span class="${showBadge ? `mini-tag ${tone}` : `spotify-inline-status ${tone}`}">${escapeHtml(value)}</span></div></article>`;
}

export function snapshotRow(iconName: string, label: string, value: string) {
  return `<article class="snapshot-row"><div class="snapshot-copy"><span class="snapshot-label">${icon(iconName)}<span>${escapeHtml(label)}</span></span></div><span class="snapshot-value">${escapeHtml(value)}</span></article>`;
}

export function toolRow(iconName: string, label: string, detail: string, view: ViewId) {
  return `<button class="tool-row" data-view="${view}" type="button"><span class="tool-row-copy"><span class="tool-row-icon">${icon(iconName)}</span><span class="tool-row-text"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(detail)}</span></span></span><span class="tool-row-chevron">${icon("chevron-right")}</span></button>`;
}

export function emptyState(title: string, text: string, view: ViewId, actionLabel: string) {
  return `<div class="empty-state"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p><button class="button-secondary" data-view="${view}" type="button">${escapeHtml(actionLabel)}</button></div>`;
}

export function emptyStateText(title: string, text: string) {
  return `<div class="empty-state"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></div>`;
}

export function renderReadinessAction(action: ReadinessAction) {
  if (action.kind === "view") {
    return `<button class="link-button readiness-action-button" data-view="${action.view}" type="button">${escapeHtml(action.label)}</button>`;
  }

  return `<button class="link-button readiness-action-button" data-readiness-action="${action.kind}" type="button">${escapeHtml(action.label)}</button>`;
}

export function navButton(currentView: ViewId, view: ViewId, label: string, iconName: string, child = false) {
  return `<button class="nav-link ${child ? "is-child " : "is-root "}${currentView === view ? "is-active" : ""}" data-view="${view}" type="button"><span class="nav-link-copy">${icon(iconName)}<span>${escapeHtml(label)}</span></span></button>`;
}

export function navGroup(
  currentView: ViewId,
  openGroups: Set<string>,
  id: string,
  label: string,
  items: Array<[ViewId, string, string]>,
) {
  const open = openGroups.has(id);
  return `<section class="nav-group"><button class="nav-group-button ${open ? "is-open" : ""}" data-group="${id}" type="button"><span>${escapeHtml(label)}</span><span class="nav-group-chevron">${icon("chevron-down")}</span></button>${open ? `<div class="nav-group-items">${items.map(([view, itemLabel, iconName]) => navButton(currentView, view, itemLabel, iconName, true)).join("")}</div>` : ""}</section>`;
}

export function issuePopover(issues: Issue[]) {
  return `<section class="issues-popover"><header><h2>Readiness issues</h2><button class="link-button" id="close-issues-button" type="button">Close</button></header>${issues.length ? `<div class="issue-list">${issues.map((issue) => `<article class="issue-item ${issue.tone}"><div><h3>${escapeHtml(issue.title)}</h3><p>${escapeHtml(issue.detail)}</p></div><button class="link-button" data-view="${issue.view}" type="button">${escapeHtml(issue.actionLabel)}</button></article>`).join("")}</div>` : `<p class="muted">Everything needed for Spotify on TV looks ready.</p>`}<div class="popover-footer"><button class="button-secondary" id="open-health-button" type="button">Open Health</button></div></section>`;
}
