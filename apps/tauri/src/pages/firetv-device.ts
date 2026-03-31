import type { FireTvStatus } from "../types";
import { metric, textInput } from "../ui/shared";
import { screenLabel } from "../features/status";

type FireTvDeviceDeps = {
  busy: boolean;
  firetvIp: string;
  currentFireTvStatus: FireTvStatus | null;
};

export function renderFireTvDevice({ busy, firetvIp, currentFireTvStatus }: FireTvDeviceDeps) {
  return `
    <section class="content-grid two-column">
      <article class="panel">
        <div class="panel-header"><div><p class="panel-kicker">Device</p><h2>ADB and device</h2></div></div>
        <form class="form" id="firetv-settings-form">
          ${textInput("firetv-ip", "Fire TV IP", firetvIp, "192.168.0.10")}
          <div class="actions">
            <button class="button-primary" id="save-firetv-settings-button" type="submit" ${busy ? "disabled" : ""}>Save Fire TV settings</button>
            <button class="button-secondary" id="firetv-check-button" type="button" ${busy ? "disabled" : ""}>Test connection</button>
            <button class="button-secondary remote-button" data-firetv-action="connect" type="button" ${busy ? "disabled" : ""}>Connect</button>
            <button class="button-secondary remote-button" data-firetv-action="ensure_awake" type="button" ${busy ? "disabled" : ""}>Wake if asleep</button>
          </div>
        </form>
      </article>
      <article class="panel">
        <div class="panel-header"><div><p class="panel-kicker">Status</p><h2>Current Fire TV state</h2></div></div>
        <div class="metric-grid">
          ${metric("ADB", currentFireTvStatus?.adb_available ? "Available" : "Missing")}
          ${metric("Connection", currentFireTvStatus?.connected ? "Connected" : "Not connected")}
          ${metric("Screen", screenLabel(currentFireTvStatus?.screen_awake))}
          ${metric("Target", currentFireTvStatus?.target ?? "No target")}
        </div>
      </article>
    </section>
  `;
}
