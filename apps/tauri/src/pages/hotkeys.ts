import type { Binding, FireTvApp } from "../types";
import { escapeHtml } from "../utils";
import {
  bindingActionOptions,
  bindingActionRequiresValue,
  bindingActionValueLabel,
  renderBindingActionControl,
  describeBindingAction,
} from "../features/bindings";
import { icon } from "../icons";
import { emptyStateText, settingsField } from "../ui/shared";

type HotkeysDeps = {
  busy: boolean;
  editingBindingId: string;
  currentBindings: Binding[];
  currentFireTvApps: FireTvApp[];
  newBindingLabel: string;
  newBindingHotkey: string;
  newBindingFavorite: boolean;
  newBindingActionType: string;
  newBindingActionValue: string;
  isRecordingHotkey: boolean;
};

function bindingForm({
  busy,
  editingBindingId,
  currentFireTvApps,
  newBindingLabel,
  newBindingHotkey,
  newBindingFavorite,
  newBindingActionType,
  newBindingActionValue,
  isRecordingHotkey,
}: Omit<HotkeysDeps, "currentBindings">) {
  return `
    <form class="form hotkey-form" id="binding-form">
      <section class="hotkey-form-block">
        <div class="hotkey-form-block-header">
          <h3>Name</h3>
          <p>Give this binding a clear label.</p>
        </div>
        ${settingsField("binding-label", "Label", newBindingLabel, "Watch Spotify on TV")}
      </section>

      <section class="hotkey-form-block">
        <div class="hotkey-form-block-header">
          <h3>Hotkey</h3>
          <p>Optional. Add a global shortcut or leave it empty for manual use only.</p>
        </div>
        <label class="settings-field">
          <span class="settings-label">Hotkey</span>
          <div class="input-with-button hotkey-input-row">
            <input class="settings-input hotkey-input ${isRecordingHotkey ? "is-recording" : ""}" id="binding-hotkey" value="${escapeHtml(newBindingHotkey)}" placeholder="Ctrl+Shift+S" />
            <button class="button-secondary hotkey-record-button" id="binding-record-hotkey-button" type="button" ${busy ? "disabled" : ""}>${isRecordingHotkey ? "Press keys..." : "Record hotkey"}</button>
          </div>
        </label>
        <p class="meta hotkey-help">${isRecordingHotkey ? "Recording hotkey. Press your combination now, Esc to cancel, or Backspace/Delete to clear." : "Type it manually or use Record hotkey."}</p>
      </section>

      <section class="hotkey-form-block">
        <div class="hotkey-form-block-header">
          <h3>Behavior</h3>
          <p>Choose what the binding does and whether it appears in Home.</p>
        </div>
        <label class="hotkey-quick-access-toggle">
          <div class="hotkey-quick-access-copy">
            <strong>Show in Quick Access</strong>
            <span>Include this binding in the Home favorites grid.</span>
          </div>
          <span class="toggle-pill ${newBindingFavorite ? "is-on" : "is-off"}">
            <input id="binding-favorite" type="checkbox" ${newBindingFavorite ? "checked" : ""} />
            <span class="toggle-pill-indicator" aria-hidden="true">${icon("check")}</span>
            <span class="toggle-pill-label">${newBindingFavorite ? "Shown" : "Hidden"}</span>
          </span>
        </label>
        <label class="settings-field">
          <span class="settings-label">Action type</span>
          <select class="settings-input" id="binding-action-type">${bindingActionOptions(newBindingActionType)}</select>
        </label>
        ${
          bindingActionRequiresValue(newBindingActionType)
            ? `<label class="settings-field"><span class="settings-label">${escapeHtml(bindingActionValueLabel(newBindingActionType))}</span>${renderBindingActionControl(newBindingActionType, newBindingActionValue, currentFireTvApps)}</label>`
            : ""
        }
      </section>

      <section class="hotkey-form-block hotkey-form-block--footer">
        <div class="hotkey-form-block-header">
          <h3>${editingBindingId ? "Update binding" : "Save binding"}</h3>
          <p>${editingBindingId ? "Update this binding and keep its existing shortcut." : "Save this binding for Home, tray, or hotkey use."}</p>
        </div>
        <div class="actions hotkey-form-actions">
          <button class="button-primary" type="submit" ${busy ? "disabled" : ""}>${editingBindingId ? "Update binding" : "Save binding"}</button>
          <button class="button-secondary" id="binding-reset-button" type="button" ${busy ? "disabled" : ""}>${editingBindingId ? "Cancel edit" : "Clear form"}</button>
        </div>
      </section>
    </form>
  `;
}

export function renderHotkeys({
  busy,
  editingBindingId,
  currentBindings,
  currentFireTvApps,
  newBindingLabel,
  newBindingHotkey,
  newBindingFavorite,
  newBindingActionType,
  newBindingActionValue,
  isRecordingHotkey,
}: HotkeysDeps) {
  return `
    <section class="content-grid two-column-wide hotkeys-page">
      <article class="panel hotkeys-create-panel">
        <div class="panel-header">
          <div>
            <p class="panel-kicker">Bindings</p>
            <h2>${editingBindingId ? "Edit binding" : "Create binding"}</h2>
            <p class="panel-subcopy">Create a reusable action for Home, tray, or a global hotkey.</p>
          </div>
        </div>
        ${bindingForm({
          busy,
          editingBindingId,
          currentFireTvApps,
          newBindingLabel,
          newBindingHotkey,
          newBindingFavorite,
          newBindingActionType,
          newBindingActionValue,
          isRecordingHotkey,
        })}
      </article>
      <article class="panel">
        <div class="panel-header">
          <div>
            <p class="panel-kicker">Registered</p>
            <h2>Bindings and hotkeys</h2>
            <p class="panel-subcopy">Existing bindings stay available while you create the next one.</p>
          </div>
        </div>
        ${
          currentBindings.length
            ? `<div class="binding-list binding-list--compact">${currentBindings
                .map(
                  (binding) => `<article class="binding-row binding-row--compact">
                  <div class="binding-main">
                    <div class="binding-title-row">
                      <h3>${escapeHtml(binding.label)}</h3>
                      ${binding.favorite ? `<span class="mini-tag">Favorite</span>` : ""}
                    </div>
                    <p>${escapeHtml(describeBindingAction(binding.action))}</p>
                  </div>
                  <div class="binding-actions binding-actions--compact">
                    ${binding.hotkey ? `<kbd>${escapeHtml(binding.hotkey)}</kbd>` : `<span class="muted">No hotkey</span>`}
                    <button class="button-secondary edit-binding-button" data-binding-id="${escapeHtml(binding.id)}" type="button" ${busy ? "disabled" : ""}>Edit</button>
                    <button class="button-secondary execute-binding-button" data-binding-id="${escapeHtml(binding.id)}" type="button" ${busy ? "disabled" : ""}>Run</button>
                    <button class="button-secondary delete-binding-button" data-binding-id="${escapeHtml(binding.id)}" type="button" ${busy ? "disabled" : ""}>Delete</button>
                  </div>
                </article>`,
                )
                .join("")}</div>`
            : emptyStateText("No bindings yet", "Create a reusable action for quick access, tray, or hotkeys.")
        }
      </article>
    </section>
  `;
}
