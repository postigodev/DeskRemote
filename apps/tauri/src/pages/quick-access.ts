import { icon } from "../icons";
import type { Binding } from "../types";
import { escapeHtml } from "../utils";
import { emptyStateText } from "../ui/shared";

type QuickAccessDeps = {
  busy: boolean;
  currentBindings: Binding[];
  favorites: Binding[];
  draggedFavoriteId: string;
  dragOverFavoriteId: string;
  bindingIcon: (action: Binding["action"]) => string;
  describeBindingAction: (action: Binding["action"]) => string;
};

export function renderQuickAccess({
  busy,
  currentBindings,
  favorites,
  draggedFavoriteId,
  dragOverFavoriteId,
  bindingIcon,
  describeBindingAction,
}: QuickAccessDeps) {
  return `
    <section class="content-grid two-column-wide quick-access-page">
      <article class="panel quick-access-manage-panel">
        <div class="panel-header"><div><p class="panel-kicker">Manage</p><h2>Quick Access</h2><p class="panel-subcopy">Choose what appears in the Home favorites grid.</p></div></div>
        ${
          currentBindings.length
            ? `<div class="quick-access-manage-list">${currentBindings
                .map(
                  (binding) => `<article class="quick-access-manage-row"><div class="quick-access-manage-main"><span class="quick-access-manage-icon">${icon(bindingIcon(binding.action))}</span><div><h3>${escapeHtml(binding.label)}</h3><p>${escapeHtml(describeBindingAction(binding.action))}</p></div></div><label class="toggle-line quick-access-toggle"><input class="favorite-toggle" data-binding-id="${escapeHtml(binding.id)}" type="checkbox" ${binding.favorite ? "checked" : ""} /><span>${binding.favorite ? "Shown" : "Hidden"}</span></label></article>`,
                )
                .join("")}</div>`
            : emptyStateText("No bindings yet", "Create a binding first in Hotkeys.")
        }
      </article>
      <article class="panel quick-access-preview-panel">
        <div class="panel-header"><div><p class="panel-kicker">Preview</p><h2>Home preview</h2><p class="panel-subcopy">Matches the Quick Access grid on Home.</p></div></div>
        ${
          favorites.length
            ? `<div class="quick-access-preview-shell"><div class="quick-grid quick-access-preview-grid">${favorites
                .slice(0, 6)
                .map(
                  (binding) => `<button class="quick-tile execute-binding-button ${draggedFavoriteId === binding.id ? "is-dragging" : ""} ${dragOverFavoriteId === binding.id ? "is-drop-target" : ""}" data-binding-id="${escapeHtml(binding.id)}" data-tooltip="${escapeHtml(describeBindingAction(binding.action))}" type="button" ${busy ? "disabled" : ""}><span class="quick-drag-handle" aria-hidden="true">${icon("grip")}</span><span class="quick-icon">${icon(bindingIcon(binding.action))}</span><span>${escapeHtml(binding.label)}</span></button>`,
                )
                .join("")}</div><p class="meta">Drag tiles on Home to reorder the grid.</p></div>`
            : emptyStateText("No favorites pinned", "Mark a binding as favorite to make it appear here.")
        }
      </article>
    </section>
  `;
}
