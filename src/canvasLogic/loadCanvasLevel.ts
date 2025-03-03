import CanvasObject from '../interfaces/CanvasObject'
import Player from './player'
import config from './config'
import { setupEventListeners } from './eventListeners'
import templeData from './gameAssets/chineseTemple'


const player = Player
const heightCoeficient = 10
const widthCoeficient = 8

const canvasObject: CanvasObject = {
  canvas: undefined,
  canvasElement: undefined
}

const drawTemple = (scale: number) => {
  if (!canvasObject?.canvas || !canvasObject.canvasElement) return

  fillCanvas(templeData.template, scale)
  const templeWidth = widthCoeficient * scale * ((templeData.template[templeData.template.length - 1].length || 0) * 0.75);
  const templeHeight = heightCoeficient * scale * templeData.template.length;

  if (canvasObject.canvasElement.width < templeWidth) {
    canvasObject.canvasElement.width = templeWidth
  }
  if (canvasObject.canvasElement.height < templeHeight) {
    canvasObject.canvasElement.height = templeHeight
  }
}

export const animateLevel = () => {
  if (!canvasObject.canvas || !canvasObject.canvasElement) return;
  if (typeof window !== undefined) window.requestAnimationFrame(animateLevel)
  // Setup background
  canvasObject.canvas.fillStyle = 'black'
  canvasObject.canvas.fillRect(0, 0, canvasObject.canvasElement.width, canvasObject.canvasElement.height)
  drawTemple(4)
  // Load Player
  player.handleMovement(config)
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

const fillCanvas = (lines: string[], scale: number) => {
  if (!canvasObject?.canvas || !canvasObject.canvasElement) return
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let scaledLine = '';
    for (let j = 0; j < line.length; j++) {
      scaledLine += line[j].repeat(Math.round(scale / 2));
    }
    for (let k = 0; k < scaledLine.length; k++) {
      for (let j = 0; j < 4; j++) {
        let char = scaledLine[k];
        canvasObject.canvas.fillStyle = templeData.colorMap[char] || 'blue';
        canvasObject.canvas.font = `${widthCoeficient * scale}px Silkscreen`;
        canvasObject.canvas.fillText(char, k * (widthCoeficient + scale), heightCoeficient * i * scale + 10 * (j * 0.25));
      }
    }
  }
}
