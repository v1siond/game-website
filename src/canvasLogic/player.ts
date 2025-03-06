import CanvasObject from "@/interfaces/CanvasObject"

const canvasObject: CanvasObject = {
  canvas: undefined,
  canvasElement: undefined
}

const fillColorMap: any = {
  '0': 'rgb(255, 0, 0)',
  '@': 'rgb(255, 0, 0)',
  '#': 'rgb(255, 0, 0)',
  '%': 'rgb(255, 0, 0)',
  '/': 'rgb(255, 0, 0)',
  '\\': 'rgb(255, 0, 0)',
  '|': 'rgb(255, 0, 0)',
  '>': 'rgb(255, 0, 0)',
  '.': 'rgb(255, 0, 0)',
  '}': 'rgb(255, 0, 0)',
  '{': 'rgb(255, 0, 0)',
  '<': 'rgb(255, 0, 0)',
  '-': 'rgb(255, 0, 0)',
  '!': 'rgb(255, 0, 0)',
  "'": 'rgb(255, 0, 0)',
}

const colorMap: any = {
  '0': 'rgba(255, 255, 255, .75)',
  '@': 'rgba(255, 255, 255, .75)',
  '#': 'rgba(255, 255, 255, .75)',
  '%': 'rgba(255, 255, 255, .75)',
  '/': 'rgba(255, 255, 255, .75)',
  '\\': 'rgba(255, 255, 255, .75)',
  '>': 'rgba(255, 255, 255, .75)',
  '<': 'rgba(255, 255, 255, .75)',
  '-': 'rgba(255, 255, 255, .75)',
  '|': 'rgba(255, 255, 255, .75)',
  '!': 'rgba(255, 255, 255, .75)',
  "'": 'rgba(255, 255, 255, .75)',
  '}': 'rgba(255, 255, 255, .75)',
  '{':  'rgba(255, 255, 255, .75)',
  '.': 'rgba(255, 255, 255, .75)',
}

const spriteStop = `
 @
{%\\
/ \\
`;


const spriteWalkingRight = `
 @
{%-
- \\
`;

const spriteWalkingRight2 = `
 @
-%\\
 >
`;


const spriteWalkingLeft = `
 @
/%}
 <
`;

const spriteWalkingLeft2 = `
 @
-%\\
/ -
`;


const spriteJump = `
\\ @ /
  %
 { }
`;

const spriteWalkingUp = `
  0/
 !%
 | '
`
const spriteWalkingUp2 = `
 \\0
  %!
 ' |
`
const spriteWalkingDown = `
 . |
  %
 /0!
`
const spriteWalkingDown2 = `
 | .
  %
 '0\\
`

let currentSprite = spriteStop
let oldTime: number = 0

const properties = {
  height: 16,
  width: 16,
  movementSpeed: 30,
  jumpHeight: 24,
  canJump: true,
  gravity: {
    coeficient: 2,
    x: 0,
    y: 0
  },
  position: {
    x: 30,
    y: 30,
    bottom: 6 * 16
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
  let lines = sprite.split('\n');
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    for (let j = 0; j < line.length; j++) {
      const x = properties.position.x + j * 15 * scale
      const y = properties.position.y + (i * 4) * 5 * scale
      let char = line[j];
      canvasObject.canvas.fillStyle = colorMap[char] || 'white';
      canvasObject.canvas.font = `bold ${25 * scale}px Silkscreen`;
      canvasObject.canvas.fillText(
        char,
        x,
        y
      );
      canvasObject.canvas.fillStyle = fillColorMap[char] || 'white';
      canvasObject.canvas.strokeStyle =  fillColorMap[char] || 'white'
      canvasObject.canvas.lineWidth = 2;
      canvasObject.canvas.strokeText(char, x, y);
    }
  }
}

export const draw = (canvasObj: any) => {
  if (!canvasObj) return;
  canvasObject.canvas = canvasObj.canvas
  canvasObject.canvasElement = canvasObj.canvasElement
  animatePlayer()
}

export const handleMovement = (config: any, time: number) => {
  const height = (canvasObject.canvasElement?.height || 0)
  const animate = (time - oldTime) >= config.interval
  properties.gravity.x = 0
  const keyPressed = Object.values(config.keys).find((key: any) => key.pressed)
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
    properties.position.y = properties.position.bottom > (properties.height * 2) ? properties.position.y + properties.movementSpeed : height - (properties.height * 2)
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
}: any) => {
  properties.width = width
  properties.height = height
  properties.position.x = width
  properties.position.y = height
  properties.jumpHeight = height * 0.66
  properties.movementSpeed = width * 0.5
  properties.position.bottom = height * 6
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
