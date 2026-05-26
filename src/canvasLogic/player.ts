import CanvasObject from "@/interfaces/CanvasObject"

interface KeyState {
  pressed: boolean;
}

interface GameConfig {
  interval: number;
  keys: {
    ArrowRight: KeyState;
    ArrowLeft: KeyState;
    ArrowUp: KeyState;
    ArrowDown: KeyState;
    [key: string]: KeyState;
  };
}

interface PlayerDimensions {
  width: number;
  height: number;
}

const canvasObject: CanvasObject = {
  canvas: undefined,
  canvasElement: undefined
}

const colorMap: Record<string, string> = {
  '0': 'rgba(255, 128, 0, 0.85)',
  'O': 'rgba(255, 128, 0, 0.85)',
  '#': 'rgba(255, 0, 0, .85)',
  '/': 'rgba(255, 255, 0, .85)',
  '\\': 'rgba(255, 255, 0, .85)',
  '>': 'rgba(255, 255, 0, .85)',
  '<': 'rgba(255, 255, 0, .85)',
  '-': 'rgba(255, 255, 0, .85)',
  '|': 'rgba(255, 255, 0, .85)',
  '!':  'rgba(255, 255, 0, .85)',
  "'": 'rgba(255, 255, 0, .85)',
  '}': 'rgba(255, 255, 0, .85)',
  '{':  'rgba(255, 255, 0, .85)',
  '.': 'rgba(255, 255, 0, .85)',
}

const spriteStop = `
 0
<#\\
/ \\
`;


const spriteWalkingRight = `
 0
/#>
- \\
`;

const spriteWalkingRight2 = `
 0
<#\\
 >
`;


const spriteWalkingLeft = `
 0
<#\\
/ -
`;

const spriteWalkingLeft2 = `
 0
/#>
 <
`;


const spriteJump = `
\\0/
 #
! !
`;

const spriteWalkingUp = `
 O
<#'
' !
`
const spriteWalkingUp2 = `
 O
'#>
! '
`
const spriteWalkingDown = `
 O
'#>
! '
`
const spriteWalkingDown2 = `
 O
<#'
' !
`

let currentSprite = spriteStop
let oldTime: number = 0

const properties = {
  height: 16,
  width: 16,
  movementSpeed: 40,
  jumpHeight: 22,
  canJump: true,
  gravity: {
    coeficient: 3,
    x: 0,
    y: 0
  },
  position: {
    x: 32,
    y: 32,
    bottom: 0
  }
}

const playerPosition = {
  bottom: properties.position.y + properties.height
}

export const updatePlayerPosition = () => {
  const height = (canvasObject.canvasElement?.height || 0)
  const width = (canvasObject.canvasElement?.width || 0)
  properties.position.x += properties.position.x <= 0 && properties.gravity.x < 0 ?
                              0 :
                              properties.position.x >= width - properties.width && properties.gravity.x > 0 ?
                              0 :
                              properties.gravity.x
  properties.position.y += properties.gravity.y
  playerPosition.bottom = properties.position.y + (properties.height + properties.position.bottom)
  properties.gravity.y = height >= (playerPosition.bottom + properties.gravity.y) ? properties.gravity.y + properties.gravity.coeficient : 0
  properties.canJump = height <= (playerPosition.bottom + properties.gravity.y)
  return properties.position.y
}

export const animatePlayer = () => {
  if (!canvasObject.canvas || !canvasObject.canvasElement) return;
  drawPlayer(currentSprite || spriteStop, 1)
}

const drawPlayer = (sprite: string, scale: number) => {
  if (!canvasObject?.canvas || !canvasObject.canvasElement) return;
  const lines = sprite.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const length = line.length
    for (let j = 0; j < length; j++) {
      const x = properties.position.x + (j > (length * 0.6) ? j : j * 0.8) * ((properties.width * 0.65) * scale)
      const y = properties.position.y + i * ((properties.height * 0.75) * scale)
      const char = line[j];
      const randomBrightness = Math.random() * 5 + 0.5;
      const colorMatch = (colorMap[char] || 'rgba(255, 255, 255, 1)').match(/[\d.]+/g);
      const [r, g, b, a] = colorMatch ? colorMatch.map(Number) : [255, 255, 255, 1];
      const brightenedColor = `rgba(${Math.min(255, r * randomBrightness)}, ${Math.min(255, g * randomBrightness)}, ${Math.min(255, b * randomBrightness)}, ${a})`;
      canvasObject.canvas.fillStyle = brightenedColor;
      canvasObject.canvas.font = `bold ${properties.height * scale}px Silkscreen`;
      canvasObject.canvas.fillText(
        char,
        x,
        y
      );
      canvasObject.canvas.strokeStyle =  'black'
      canvasObject.canvas.lineWidth = 1;
      canvasObject.canvas.strokeText(char, x, y);
      canvasObject.canvas.strokeStyle =  brightenedColor
      canvasObject.canvas.lineWidth = 1;
      canvasObject.canvas.strokeText(char, x + 1, y + 1);
      canvasObject.canvas.fillStyle = char == '0' || char === 'O' ? colorMap[char] : brightenedColor;
      canvasObject.canvas.font = `bold ${properties.height * scale}px Silkscreen`;
      canvasObject.canvas.fillText(
        char,
        x,
        y
      );
    }
  }
}

export const draw = (canvasObj: CanvasObject) => {
  if (!canvasObj) return;
  canvasObject.canvas = canvasObj.canvas
  canvasObject.canvasElement = canvasObj.canvasElement
  animatePlayer()
}

export const handleMovement = (config: GameConfig, time: number) => {
  const height = (canvasObject.canvasElement?.height || 0)
  const animate = (time - oldTime) >= config.interval
  properties.gravity.x = 0
  const keyPressed = Object.values(config.keys).find((key: KeyState) => key.pressed)
  if (config.keys.ArrowRight.pressed) {
    currentSprite = animate ? (properties.gravity.y == 0 ? (currentSprite === spriteWalkingRight ? spriteWalkingRight2 : spriteWalkingRight) : spriteJump) : currentSprite
    properties.gravity.x = properties.movementSpeed
  }
  if (config.keys.ArrowLeft.pressed) {
    currentSprite = animate ? (properties.gravity.y == 0 ? (currentSprite === spriteWalkingLeft ? spriteWalkingLeft2 : spriteWalkingLeft) : spriteJump) : currentSprite
    properties.gravity.x = -properties.movementSpeed
  }
  if (config.keys.ArrowUp.pressed) {
    currentSprite = animate ? (properties.gravity.y == 0 ? (currentSprite === spriteWalkingUp ? spriteWalkingUp2 : spriteWalkingUp) : spriteJump) : currentSprite
    properties.position.bottom += properties.movementSpeed
    properties.position.y -= properties.movementSpeed
  }
  if (config.keys.ArrowDown.pressed) {
    currentSprite = animate ? (properties.gravity.y == 0 ? (currentSprite === spriteWalkingDown2 ? spriteWalkingDown : spriteWalkingDown2) : spriteJump) : currentSprite
    properties.position.bottom = properties.position.bottom > (properties.height * 2) ? properties.position.bottom - properties.movementSpeed : properties.height
    properties.position.y = properties.position.bottom > (properties.height * 2) ? properties.position.y + properties.movementSpeed : height - (properties.height)
  }
  if (keyPressed && animate) {
    oldTime = animate ? time + config.interval : oldTime;
  }
  if (!keyPressed && animate) currentSprite = properties.gravity.y == 0 ? spriteStop : spriteJump
}

export const jump = () => {
  const height = (canvasObject.canvasElement?.height || 0)
  if (!properties.canJump) return;
  if (properties.gravity.y == 0 && height <= playerPosition.bottom) {
    currentSprite = spriteJump
    properties.canJump = false
    return properties.gravity.y = -properties.jumpHeight
  }
  properties.gravity.y = 0
}

const buildPlayer = ({
  width,
  height
}: PlayerDimensions) => {
  properties.width = width
  properties.height = height
  properties.position.x = width
  properties.position.y = height
  properties.jumpHeight = height * 0.66
  properties.movementSpeed = width * 0.5
  properties.position.bottom = height * 2
  return {
    draw,
    jump,
    properties,
    animatePlayer,
    handleMovement,
    updatePlayerPosition
  }
}

export default buildPlayer
