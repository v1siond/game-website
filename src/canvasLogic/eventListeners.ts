interface KeyState {
  pressed: boolean;
}

interface GameConfig {
  keys: Record<string, KeyState>;
}

interface Player {
  jump: () => void;
}

/**
 * Setup keyboard event listeners for player control.
 * Returns a cleanup function that removes all event listeners.
 */
export const setupEventListeners = (player: Player, config: GameConfig): () => void => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (config.keys[event.key]) {
      event.preventDefault();
      config.keys[event.key].pressed = true
    }
    if (event.key === ' ') {
      event.preventDefault();
      return player.jump();
    }
  }

  const handleKeyUp = (event: KeyboardEvent) => {
    if (config.keys[event.key]) config.keys[event.key].pressed = false
  }

  window.addEventListener("keydown", handleKeyDown)
  window.addEventListener("keyup", handleKeyUp)

  // Return cleanup function
  return () => {
    window.removeEventListener("keydown", handleKeyDown)
    window.removeEventListener("keyup", handleKeyUp)
  }
}
