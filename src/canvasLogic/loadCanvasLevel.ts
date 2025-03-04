import CanvasObject from '../interfaces/CanvasObject'
import Player from './player'
import config from './config'
import { setupEventListeners } from './eventListeners'
import templeData from './gameAssets/chineseTemple'


const player = Player
const heightCoeficient = 32
const widthCoeficient = 32
var fps, fpsInterval: number, startTime, now, then: number, elapsed;

const canvasObject: CanvasObject = {
  canvas: undefined,
  canvasElement: undefined
}


let charAnimated: any = {}

const drawTemple = (scale: number) => {
  if (!canvasObject?.canvas || !canvasObject.canvasElement) return

  fillCanvas(scale)
  const templeWidth = widthCoeficient * scale * templeData.template[templeData.template.length - 1].length;
  const templeHeight = heightCoeficient * scale * templeData.template.length;

  if (canvasObject.canvasElement.width < templeWidth) {
    canvasObject.canvasElement.width = templeWidth
  }
  if (canvasObject.canvasElement.height < templeHeight) {
    canvasObject.canvasElement.height = templeHeight
  }
}

const fillCanvas = (scale: number) => {
  if (!canvasObject?.canvas || !canvasObject.canvasElement) return
  Object.values(templeData.templateMap).forEach((lines: any) => {
    lines.forEach((line: any) => {
      if (!canvasObject.canvas) return
      const animate = charAnimated[`${line.rowNumber}${line.columnNumber}`]
      canvasObject.canvas.strokeStyle = 'white';
      canvasObject.canvas.lineWidth = .1;
      canvasObject.canvas.strokeRect(line.columnNumber * (widthCoeficient + scale), heightCoeficient * line.rowNumber * scale, widthCoeficient, heightCoeficient);
      canvasObject.canvas.fillStyle = line.fillColor || 'black';
      canvasObject.canvas.font = animate && line.animation ? `italic bold ${widthCoeficient * scale}px Silkscreen` : `bold ${widthCoeficient * scale}px Silkscreen`;
      canvasObject.canvas.fillRect(line.columnNumber * (widthCoeficient + scale), heightCoeficient * line.rowNumber * scale, widthCoeficient, heightCoeficient)
      canvasObject.canvas.fillStyle = line.animation && animate ? line.animation.color : line.color || 'black';
      canvasObject.canvas.fillText(line.value, line.columnNumber * (widthCoeficient + scale), heightCoeficient * line.rowNumber * scale);
      if (line.animation)
        setTimeout(() => {
          charAnimated[`${line.rowNumber}${line.columnNumber}`] = !charAnimated[`${line.rowNumber}${line.columnNumber}`]
        }, line.animation.interval)
    })
  })
}

export const animateLevel = () => {
  if (!canvasObject.canvas || !canvasObject.canvasElement) return;
  if (typeof window !== undefined) window.requestAnimationFrame(animateLevel);
  // Setup background
  canvasObject.canvas.fillStyle = 'black'
  canvasObject.canvas.fillRect(0, 0, canvasObject.canvasElement.width, canvasObject.canvasElement.height)

  drawTemple(1)
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

  animateLevel();


  setupEventListeners(player, config)
}
