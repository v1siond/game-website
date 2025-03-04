import CanvasObject from '../interfaces/CanvasObject'
import Player from './player'
import config from './config'
import { setupEventListeners } from './eventListeners'
import templeData from './gameAssets/chineseTemple'


const player = Player
const heightCoeficient = 32
const widthCoeficient = 32
let oldTime: number = 0

const canvasObject: CanvasObject = {
  canvas: undefined,
  canvasElement: undefined
}


const drawTemple = (scale: number, time?: number) => {
  if (!canvasObject?.canvas || !canvasObject.canvasElement) return

  fillCanvas(scale, time)
  const templeWidth = widthCoeficient * scale * templeData.template[templeData.template.length - 1].length;
  const templeHeight = heightCoeficient * scale * templeData.template.length;

  if (canvasObject.canvasElement.width < templeWidth) {
    canvasObject.canvasElement.width = templeWidth
  }
  if (canvasObject.canvasElement.height < templeHeight) {
    canvasObject.canvasElement.height = templeHeight
  }
}

const fillCanvas = (scale: number, time?: number) => {
  if (!canvasObject?.canvas || !canvasObject.canvasElement) return
  Object.values(templeData.templateMap).forEach((lines: any) => {
    lines.forEach((line: any) => {
      if (!canvasObject.canvas) return
      const x = line.columnNumber * (widthCoeficient + scale)
      const y = heightCoeficient * line.rowNumber * scale
      const animate = line.animation && oldTime % line.animation.interval === 0
      console.log(animate, oldTime)
      canvasObject.canvas.strokeStyle = 'white';
      canvasObject.canvas.lineWidth = .1;
      canvasObject.canvas.strokeRect(x, y, widthCoeficient, heightCoeficient);

      // Apply brightness adjustment to a specific section of the canvas
      const randomBrightness = Math.random() * 3 + 0.5; // Random value between 0.5 and 2
      const [r, g, b, a] = line.color.match(/[\d.]+/g).map(Number);
      const brightenedColor = `rgba(${Math.min(255, r * randomBrightness)}, ${Math.min(255, g * randomBrightness)}, ${Math.min(255, b * randomBrightness)}, ${a})`;
      canvasObject.canvas.fillStyle = line.fillColor || 'black';
      canvasObject.canvas.fillRect(x, y, widthCoeficient, heightCoeficient)

      canvasObject.canvas.font = animate ? `italic bold ${widthCoeficient * scale}px PermanentMarker` : `bold ${widthCoeficient * scale}px PermanentMarker`;
      canvasObject.canvas.fillStyle = animate ? brightenedColor : line.color || 'black';
      canvasObject.canvas.fillText(line.value, x, y);
      if (line.animation) oldTime = (oldTime || 0) + 1
    })
  })
}

/*


      const x = line.columnNumber * (widthCoeficient + scale)
      const y = heightCoeficient * line.rowNumber * scale

      if (line.animation && animate) {
        setTimeout(() => {
          charAnimated[`${line.rowNumber}${line.columnNumber}`] = !charAnimated[`${line.rowNumber}${line.columnNumber}`]
        }, line.animation.interval)
      }
*/

export const animateLevel = (time?: number) => {
  if (!canvasObject.canvas || !canvasObject.canvasElement) return;

  const fps60 = 1000 / 60;

  if (typeof window !== undefined)
    window.requestAnimationFrame((time) => {
      setTimeout(() => animateLevel(time), fps60);
    });
  // Setup background
  canvasObject.canvas.fillStyle = 'black'
  canvasObject.canvas.fillRect(0, 0, canvasObject.canvasElement.width, canvasObject.canvasElement.height)

  drawTemple(1, time)
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

  animateLevel(0);


  setupEventListeners(player, config)
}
