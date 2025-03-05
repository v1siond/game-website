import CanvasObject from '../interfaces/CanvasObject'
import Player from './player'
import config from './config'
import { setupEventListeners } from './eventListeners'
import templeData from './gameAssets/chineseTemple'

const defaultFont = 'Silkscreen'

const player = Player
const heightCoeficient = 32
const widthCoeficient = 32
let oldTime: number = 0

const canvasObject: CanvasObject = {
  canvas: undefined,
  canvasElement: undefined
}


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
      const animate = (line.animation && oldTime % line.animation?.interval === 0)
      const x = (line.columnNumber * (widthCoeficient + scale))
      const y = (heightCoeficient * line.rowNumber * scale)

      // Apply brightness adjustment to a specific section of the canvas
      const randomBrightness = Math.random() * 5 + 0.5; // Random value between 0.5 and 2
      const [r, g, b, a] = line.color.match(/[\d.]+/g).map(Number);
      const [r2, g2, b2, a2] = line.color.match(/[\d.]+/g).map(Number);
      const brightenedColor = `rgba(${Math.min(255, r * randomBrightness)}, ${Math.min(255, g * randomBrightness)}, ${Math.min(255, b * randomBrightness)}, ${a})`;
      const brightenedCFillolor = `rgba(${Math.min(255, r2 * randomBrightness)}, ${Math.min(255, g2 * randomBrightness)}, ${Math.min(255, b2 * randomBrightness)}, ${a2})`;

      canvasObject.canvas.font = animate && line.animation?.name?.includes('move') ? `italic ${widthCoeficient * scale}px ${defaultFont}` : `bold ${widthCoeficient * scale}px ${defaultFont}`;
      canvasObject.canvas.fillStyle = animate && line.animation?.name?.includes('brightup') ? brightenedColor : line.color || 'black';
      canvasObject.canvas.strokeStyle =  animate && line.animation?.name?.includes('brightup') ? brightenedCFillolor : line.fillColor || 'white'
      canvasObject.canvas.lineWidth = 3;
      canvasObject.canvas.fillText(line.value, x, y);
      canvasObject.canvas.strokeText(line.value, x, y);
      if (line.value === ' ') {
        canvasObject.canvas.fillStyle = line.fillColor || 'rgba(255,255,255,.2)';
        canvasObject.canvas.fillRect(x, y, widthCoeficient, heightCoeficient)
      }
      if (animate && line.animation?.name?.includes('brightup') || line.value === ' ') {
        canvasObject.canvas.fillStyle = animate && line.animation?.name?.includes('brightup') ? brightenedColor : line.fillColor || 'black';
        canvasObject.canvas.lineWidth = 1;
        canvasObject.canvas.strokeRect(x, y, widthCoeficient, heightCoeficient)
      }
      oldTime = (oldTime || 0) + 1
    })
  })
}

export const animateLevel = () => {
  if (!canvasObject.canvas || !canvasObject.canvasElement) return;



  if (typeof window !== undefined)
    window.requestAnimationFrame(() => setTimeout(() => animateLevel(), 1000 / 60));
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
