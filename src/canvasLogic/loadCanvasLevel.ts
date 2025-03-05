import CanvasObject from '../interfaces/CanvasObject'
import Player from './player'
import config from './config'
import { setupEventListeners } from './eventListeners'
import templeData from './gameAssets/chineseTemple'

const defaultFont = 'Silkscreen'

const player = Player
const cellHeight = 32
const cellWidth = 32
let oldTime: number = 0
let cellAnimated: any = {}

const canvasObject: CanvasObject = {
  canvas: undefined,
  canvasElement: undefined
}


const drawTemple = (scale: number, time: number) => {
  if (!canvasObject?.canvas || !canvasObject.canvasElement) return

  fillCanvas(scale, time)
  const templeWidth = cellWidth * scale * templeData.template[templeData.template.length - 1].length;
  const templeHeight = cellHeight * scale * templeData.template.length;

  if (canvasObject.canvasElement.width < templeWidth) {
    canvasObject.canvasElement.width = templeWidth
  }
  if (canvasObject.canvasElement.height < templeHeight) {
    canvasObject.canvasElement.height = templeHeight
  }
}

const fillCanvas = (scale: number, time: number) => {
  if (!canvasObject?.canvas || !canvasObject.canvasElement) return
  Object.values(templeData.templateMap).forEach((lines: any, rowIndex: number) => {
    lines.forEach((line: any, columnIndex: number) => {
      if (!canvasObject.canvas) return
      const animate = line.animation && (time - oldTime) >= line.animation.interval
      const moveAnimation = line.animation?.name?.includes('move')
      const lightenAnimation = line.animation?.name?.includes('brightup')

      // Apply brightness adjustment to a specific section of the canvas
      const randomBrightness = Math.random() * 5 + 0.5; // Random value between 0.5 and 2
      const [r, g, b, a] = line.color.match(/[\d.]+/g).map(Number);
      const [r2, g2, b2, a2] = line.color.match(/[\d.]+/g).map(Number);
      const brightenedColor = `rgba(${Math.min(255, r * randomBrightness)}, ${Math.min(255, g * randomBrightness)}, ${Math.min(255, b * randomBrightness)}, ${a})`;
      const brightenedFillColor = `rgba(${Math.min(255, r2 * randomBrightness)}, ${Math.min(255, g2 * randomBrightness)}, ${Math.min(255, b2 * randomBrightness)}, ${a2})`;

      const animations = {
        font: {
          static: `bold ${cellWidth * scale}px ${defaultFont}`,
          dynamic: `italic bold ${cellWidth * scale}px ${defaultFont}`,
        },
        color: {
          static: line.color || 'black',
          dynamic: brightenedColor,
          staticFill: line.fillColor,
          dynamicFill: brightenedFillColor
        }
      }

      const currentCell = cellAnimated[`${rowIndex}${columnIndex}`] || {}
      const newCell = {
        font: {
          current: animate && moveAnimation ? (currentCell?.font?.current === animations.font.dynamic ? animations.font.static : animations.font.dynamic) : currentCell?.font?.current || animations.font.static
        },
        color: {
          current: animate && lightenAnimation? (currentCell?.color?.current === animations.color.dynamic ? animations.color.static : animations.color.dynamic) : currentCell?.color?.current || animations.color.static,
          currentFill: animate && lightenAnimation ?
            (currentCell?.color?.currentFill === animations.color.dynamicFill ? animations.color.staticFill : animations.color.dynamicFill) :
            currentCell?.color?.currentFill || animations.color.staticFill,
          currentInverted: animate && lightenAnimation? (currentCell?.color?.currentInverted === animations.color.dynamicFill ? animations.color.static : animations.color.dynamicFill) : currentCell?.color?.currentInverted || animations.color.static,
        }
      }

      cellAnimated[`${rowIndex}${columnIndex}`] = newCell
      // Calculate the center position for the text
      const textWidth = canvasObject.canvas.measureText(line.value).width;
      const x = (line.columnNumber * (cellWidth + scale))
      const y = (cellHeight * line.rowNumber * scale)
      const centeredX = (cellWidth / 2) - (textWidth / 2) + x;
      const textHeight = textWidth * scale;
      const centeredY = cellHeight - (textHeight / 2) + y;

      canvasObject.canvas.font = newCell.font.current;
      canvasObject.canvas.strokeStyle = lightenAnimation ? newCell.color.currentFill : animations.color.staticFill
      canvasObject.canvas.lineWidth = 3;
      canvasObject.canvas.fillText(line.value, centeredX, centeredY);
      canvasObject.canvas.strokeText(line.value, centeredX, centeredY);
      canvasObject.canvas.fillStyle = line.value === ' ' ? line.fillColor : line.color
      canvasObject.canvas.fillRect(x, y, cellWidth +1, cellHeight +1)
    })
  })
  oldTime = time > oldTime ? time + 500 : oldTime
}

export const animateLevel = (time: number) => {
  if (!canvasObject.canvas || !canvasObject.canvasElement) return;



  if (typeof window !== undefined)
    window.requestAnimationFrame((time) => setTimeout(() => animateLevel(time), 1000 / 60));
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
