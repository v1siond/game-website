import CanvasObject from '../interfaces/CanvasObject'
import Player from './player'
import config from './config'
import { setupEventListeners } from './eventListeners'


const player = Player

const canvasObject: CanvasObject = {
  canvas: undefined,
  canvasElement: undefined
}

export const animateLevel = () => {
  if (!canvasObject.canvas || !canvasObject.canvasElement) return;
  if (typeof window !== undefined) window.requestAnimationFrame(animateLevel)
  // Setup background
  canvasObject.canvas.fillStyle = 'black'
  canvasObject.canvas.fillRect(0, 0, canvasObject.canvasElement.width, canvasObject.canvasElement.height)

  player.handleMovement(config)

  // Load Player
  player.draw(canvasObject)
  player.updatePlayerPosition()
}

export const loadCanvasLevel = (canvasElement: HTMLCanvasElement) => {
  const canvas = canvasElement.getContext('2d') as CanvasRenderingContext2D | null

  if (!canvas) return;

  canvasObject.canvas = canvas

  canvasObject.canvasElement = canvasElement
  canvasObject.canvasElement.width = config.cellSize * config.width
  canvasObject.canvasElement.height = config.cellSize * config.height

  animateLevel()
  setupEventListeners(player, config)
}