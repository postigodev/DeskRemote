import type { AppConfig, FireTvStatus, Issue, SpotifyStatus, ViewId } from "../types";

export type ReadinessAction =
  | { kind: "view"; view: ViewId; label: string }
  | { kind: "wake-tv" | "firetv-retry"; label: string };

export type ReadinessRow = {
  label: string;
  detail: string;
  status: string;
  action: ReadinessAction | null;
  tone: "ready" | "warning" | "error";
};

export function screenLabel(value: boolean | null | undefined) {
  return value === true ? "Awake" : value === false ? "Asleep" : "Unavailable";
}

export function readinessRows(
  currentConfig: AppConfig,
  currentFireTvStatus: FireTvStatus | null,
  currentSpotifyStatus: SpotifyStatus | null,
): ReadinessRow[] {
  const fireTvConfigured = Boolean(currentConfig.firetv_ip.trim());
  const fireTvConnected = Boolean(currentFireTvStatus?.connected);
  const tvAwake = currentFireTvStatus?.screen_awake === true;
  const spotifyAuthed = Boolean(currentSpotifyStatus?.authenticated);
  const targetFound = Boolean(currentSpotifyStatus?.target_found);

  return [
    {
      label: "Fire TV reachable",
      detail: fireTvConnected
        ? "Connected via ADB"
        : fireTvConfigured
          ? "Device is not responding on the configured address"
          : "No Fire TV IP configured yet",
      status: fireTvConnected ? "Ready" : fireTvConfigured ? "Offline" : "Missing",
      action: fireTvConnected
        ? null
        : fireTvConfigured
          ? { kind: "firetv-retry", label: "Retry" }
          : { kind: "view", view: "firetv-device", label: "Edit IP" },
      tone: fireTvConnected ? "ready" : "error",
    },
    {
      label: "TV awake",
      detail: tvAwake ? "Device is responsive" : "Wake the device before starting playback",
      status: tvAwake ? "Ready" : fireTvConnected ? "Waking" : "Checking",
      action: tvAwake ? null : { kind: "wake-tv", label: "Wake TV" },
      tone: tvAwake ? "ready" : "warning",
    },
    {
      label: "Spotify authenticated",
      detail: spotifyAuthed ? "Authentication active" : "Spotify needs authorization before transfer",
      status: spotifyAuthed ? "Ready" : "Needs auth",
      action: spotifyAuthed ? null : { kind: "view", view: "spotify", label: "Re-authenticate" },
      tone: spotifyAuthed ? "ready" : "error",
    },
    {
      label: "Target device detected",
      detail: targetFound
        ? currentSpotifyStatus?.target_name ?? "TV target available"
        : "Open Spotify on the TV or review the target hints",
      status: targetFound ? "Ready" : "Not found",
      action: targetFound ? null : { kind: "view", view: "spotify", label: "Edit target hints" },
      tone: targetFound ? "ready" : "warning",
    },
  ];
}

export function deriveIssues(
  currentConfig: AppConfig,
  currentFireTvStatus: FireTvStatus | null,
  currentSpotifyStatus: SpotifyStatus | null,
): Issue[] {
  const issues: Issue[] = [];
  if (!currentConfig.firetv_ip.trim()) {
    issues.push({
      title: "Fire TV IP missing",
      detail: "Configure the target device before trying to control the TV.",
      view: "firetv-device",
      actionLabel: "Open device",
      tone: "error",
    });
  } else if (currentFireTvStatus && !currentFireTvStatus.connected) {
    issues.push({
      title: "Fire TV not connected",
      detail: "The configured device is not responding over ADB.",
      view: "firetv-device",
      actionLabel: "Reconnect",
      tone: "error",
    });
  }
  if (currentSpotifyStatus && !currentSpotifyStatus.authenticated) {
    issues.push({
      title: "Spotify authentication required",
      detail: "Authenticate Spotify before trying to transfer playback.",
      view: "spotify",
      actionLabel: "Open Spotify",
      tone: "error",
    });
  }
  if (currentSpotifyStatus?.authenticated && !currentSpotifyStatus.target_found) {
    issues.push({
      title: "Target device not detected",
      detail: "Open Spotify on the TV or review your target hints.",
      view: "spotify",
      actionLabel: "Review target",
      tone: "warning",
    });
  }
  return issues;
}

export function sectionLabel(view: ViewId) {
  if (["spotify", "quick-access", "hotkeys"].includes(view)) return "Playback";
  if (["firetv-device", "apps", "remote"].includes(view)) return "Fire TV";
  if (["health", "general"].includes(view)) return "System";
  return "Dashboard";
}

export function titleForView(view: ViewId) {
  const map: Record<ViewId, string> = {
    home: "Home",
    spotify: "Spotify",
    "quick-access": "Quick Access",
    hotkeys: "Hotkeys",
    "firetv-device": "ADB & Device",
    apps: "Apps",
    remote: "Remote",
    health: "Health",
    general: "General",
  };
  return map[view];
}
