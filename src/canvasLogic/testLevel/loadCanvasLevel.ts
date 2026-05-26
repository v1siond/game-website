import CanvasObject from '../../interfaces/CanvasObject'
import Player from '../player'
import config from '../config'
import { setupEventListeners } from '../eventListeners'
import templeData from '../gameAssets/chineseTemple'
import { CellData } from '../../interfaces/GameAsset'

interface CellAnimationState {
  font?: { current: string };
  color?: { current: string; currentFill: string; currentInverted: string };
}

const defaultFont = 'Silkscreen'

const cellHeight = 32
const cellWidth = 32
const player = Player({
  height: cellHeight,
  width: cellWidth
})
let oldTime: number = 0
const cellAnimated: Record<string, CellAnimationState> = {}

const canvasObject: CanvasObject = {
  canvas: undefined,
  canvasElement: undefined
}

// Track animation frame ID for cleanup
let animationFrameId: number | null = null
let cleanupEventListeners: (() => void) | null = null


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
  if (!canvasObject?.canvas || !canvasObject.canvasElement) return;

  const canvas = canvasObject.canvas;
  const templateMap = templeData.templateMap;
  const scaleCellWidth = cellWidth * scale;
  const fontStatic = `bold ${scaleCellWidth}px ${defaultFont}`;
  const fontDynamic = `italic bold ${scaleCellWidth}px ${defaultFont}`;

  Object.entries(templateMap).forEach(([rowIndex, lines]: [string, CellData[]]) => {
    lines.forEach((line: CellData, columnIndex: number) => {
      const animate = line.animation && (time - oldTime) >= line.animation.interval;
      const moveAnimation = line.animation?.name?.includes('move');
      const lightenAnimation = line.animation?.name?.includes('brightup');

      const randomBrightness = Math.random() * 5 + 0.5;
      const colorMatch = line.color.match(/[\d.]+/g);
      const [r, g, b, a] = colorMatch ? colorMatch.map(Number) : [255, 255, 255, 1];
      const brightenedColor = `rgba(${Math.min(255, r * randomBrightness)}, ${Math.min(255, g * randomBrightness)}, ${Math.min(255, b * randomBrightness)}, ${a < .75 ? .75 : a})`;
      const brightenedFillColor = `rgba(${Math.min(255, r * randomBrightness)}, ${Math.min(255, g * randomBrightness)}, ${Math.min(255, b * randomBrightness)}, ${a < .75 ? .75 : a})`;

      const animations = {
        font: {
          static: fontStatic,
          dynamic: fontDynamic,
        },
        color: {
          static: line.color || 'black',
          dynamic: brightenedColor,
          staticFill: line.fillColor,
          dynamicFill: brightenedFillColor,
        },
      };

      const currentCell = cellAnimated[`${rowIndex}${columnIndex}`] || {};
      const newCell = {
        font: {
          current: animate && moveAnimation
            ? (currentCell?.font?.current === animations.font.dynamic ? animations.font.static : animations.font.dynamic)
            : currentCell?.font?.current || animations.font.static,
        },
        color: {
          current: animate && lightenAnimation
            ? (currentCell?.color?.current === animations.color.dynamic ? animations.color.static : animations.color.dynamic)
            : currentCell?.color?.current || animations.color.static,
          currentFill: animate && lightenAnimation
            ? (currentCell?.color?.currentFill === animations.color.dynamicFill ? animations.color.staticFill : animations.color.dynamicFill)
            : currentCell?.color?.currentFill || animations.color.staticFill,
          currentInverted: animate && lightenAnimation
            ? (currentCell?.color?.currentInverted === animations.color.dynamicFill ? animations.color.static : animations.color.dynamicFill)
            : currentCell?.color?.currentInverted || animations.color.static,
        },
      };

      const textWidth = canvas.measureText(line.value).width;
      const x = line.columnNumber * (cellWidth + scale);
      const y = cellHeight * line.rowNumber * scale;
      const centeredX = (cellWidth / 2) - (textWidth / 2) + x;
      const textHeight = textWidth * scale;
      const centeredY = cellHeight - (textHeight / 2) + y;

      canvas.font = newCell.font.current;
      canvas.strokeStyle = lightenAnimation ? newCell.color.currentFill : animations.color.staticFill;
      canvas.lineWidth = 3;
      canvas.fillText(line.value, centeredX, centeredY);
      canvas.strokeText(line.value, centeredX, centeredY);
      canvas.fillStyle = line.value === ' ' ? animations.color.staticFill : animations.color.static;
      canvas.fillRect(x, y, cellWidth + 1, cellHeight + 1);

      cellAnimated[`${rowIndex}${columnIndex}`] = newCell;
    });
  });
  oldTime = time > oldTime ? time + 500 : oldTime;
}

export const animateLevel = (time: number) => {
  if (!canvasObject.canvas || !canvasObject.canvasElement) return;

  // Setup background
  canvasObject.canvas.fillStyle = 'black'
  canvasObject.canvas.fillRect(0, 0, canvasObject.canvasElement.width, canvasObject.canvasElement.height)

  drawTemple(1, time)
  // Load Player
  player.handleMovement(config, time)
  player.draw(canvasObject)
  player.updatePlayerPosition()

  // Schedule next frame (store ID for cleanup)
  if (typeof window !== 'undefined') {
    animationFrameId = window.requestAnimationFrame((newTime) =>
      setTimeout(() => animateLevel(newTime), 1000 / 60)
    )
  }
}

/**
 * Load and start the canvas level.
 * Returns a cleanup function that stops the animation loop and removes event listeners.
 */
export const loadCanvasLevel = (canvasElement: HTMLCanvasElement): (() => void) => {
  const canvas = canvasElement.getContext('2d') as CanvasRenderingContext2D | null

  if (!canvas) return () => {};

  canvasObject.canvas = canvas

  canvasObject.canvasElement = canvasElement
  canvasObject.canvasElement.width = config.cellSize * config.width
  canvasObject.canvasElement.height = config.cellSize * config.height

  animateLevel(0);

  cleanupEventListeners = setupEventListeners(player, config)

  // Return cleanup function
  return () => {
    // Cancel animation frame
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
    // Remove event listeners
    if (cleanupEventListeners) {
      cleanupEventListeners()
      cleanupEventListeners = null
    }
    // Clear canvas references
    canvasObject.canvas = undefined
    canvasObject.canvasElement = undefined
  }
}
