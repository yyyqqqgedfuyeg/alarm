/** Audio playback for the bundled alarm recording. */
class AlarmAudio {
  constructor() {
    this.enabled = false;
    this.source = new URL("assets/audio.mp3", document.baseURI).href;
    this.activePlayers = new Set();
  }

  init() {
    // Playback is started only in response to user interaction, as required by browsers.
  }

  playAlarm() {
    if (!this.enabled) return;
    const player = new Audio(this.source);
    player.preload = "auto";
    this.activePlayers.add(player);
    const cleanup = () => this.activePlayers.delete(player);
    player.addEventListener("ended", cleanup, { once: true });
    player.addEventListener("error", cleanup, { once: true });
    player.play().catch((error) => {
      cleanup();
      console.error("Unable to play alarm audio:", error);
    });
  }
}

const radarSound = new AlarmAudio();

