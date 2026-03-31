export function renderRemote(busy: boolean) {
  return `
    <section class="panel">
      <div class="panel-header"><div><p class="panel-kicker">Manual control</p><h2>Remote</h2></div></div>
      <div class="remote-toolbar">
        <button class="button-secondary remote-button" data-firetv-action="home" type="button" ${busy ? "disabled" : ""}>Home</button>
        <button class="button-secondary remote-button" data-firetv-action="back" type="button" ${busy ? "disabled" : ""}>Back</button>
        <button class="button-secondary remote-button" data-firetv-action="launch_spotify" type="button" ${busy ? "disabled" : ""}>Open Spotify</button>
        <button class="button-secondary remote-button" data-firetv-action="play_pause" type="button" ${busy ? "disabled" : ""}>Play/Pause</button>
      </div>
      <div class="remote-pad">
        <button class="button-secondary remote-button" data-firetv-action="up" type="button" ${busy ? "disabled" : ""}>Up</button>
        <div class="remote-pad-row">
          <button class="button-secondary remote-button" data-firetv-action="left" type="button" ${busy ? "disabled" : ""}>Left</button>
          <button class="button-primary remote-button" data-firetv-action="select" type="button" ${busy ? "disabled" : ""}>Select</button>
          <button class="button-secondary remote-button" data-firetv-action="right" type="button" ${busy ? "disabled" : ""}>Right</button>
        </div>
        <button class="button-secondary remote-button" data-firetv-action="down" type="button" ${busy ? "disabled" : ""}>Down</button>
      </div>
    </section>
  `;
}
