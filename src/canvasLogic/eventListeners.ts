export const setupEventListeners = (player: any, config: any) => {
  window.addEventListener("keydown", (event) => {
    if (config.keys[event.key]) config.keys[event.key].pressed = true
    if (event.key === 'ArrowUp') return player.jump()
  })
  window.addEventListener("keyup", (event) => {
    if (config.keys[event.key]) config.keys[event.key].pressed = false
  })
}
