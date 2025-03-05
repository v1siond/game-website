import CanvasObject from "@/interfaces/CanvasObject"

const canvasObject: CanvasObject = {
  canvas: undefined,
  canvasElement: undefined
}

const colorMap: any = {
  '@': 'rgba(243, 191, 54, 1)',
  '#': 'rgb(134, 91, 61)',
  '/': 'rgba(255, 0, 0, 1)',
  '\\': 'rgba(255, 0, 0, .75)',
  '>': 'rgba(255, 255, 255, .75)',
  '<': 'rgba(255, 255, 255, .75)',
  '-': 'rgba(255, 255, 255, .75)'
}

const spriteStop = `
 @
/#\\
/ \\
`;


const spriteWalkingRight = `
 @
/#-
/ >
`;

const spriteWalkingRight2 = `
 @
-#\\
> \\
`;


const spriteWalkingLeft = `
 @
/#-
< \\
`;

const spriteWalkingLeft2 = `
 @
-#\\
/ <
`;


const spriteJump = `
\\ @ /
  #
 < >
`;

let currentSprite = spriteStop

const properties = {
  height: 32,
  width: 32,
  movementSpeed: 15,
  jumpHeight: 24,
  canJump: true,
  gravity: {
    coeficient: 2,
    x: 0,
    y: 0
  },
  position: {
    x: 30,
    y: 30
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
  playerPosition.bottom = properties.position.y + (properties.height * 13)
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
      canvasObject.canvas.font = `bold ${20 * scale}px Silkscreen`;
      canvasObject.canvas.fillText(
        char,
        x,
        y
      );
      canvasObject.canvas.strokeStyle =  colorMap[char] || 'white'
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

export const handleMovement = (config: any) => {
  properties.gravity.x = 0
  if (config.keys.ArrowRight.pressed) {
    currentSprite = properties.gravity.y == 0 ? (currentSprite === spriteWalkingRight ? spriteWalkingRight2 : spriteWalkingRight) : spriteJump
    return properties.gravity.x = properties.movementSpeed
  }
  if (config.keys.ArrowLeft.pressed) {
    currentSprite = properties.gravity.y == 0 ? (currentSprite === spriteWalkingLeft ? spriteWalkingLeft2 : spriteWalkingLeft) : spriteJump
    return properties.gravity.x = -properties.movementSpeed
  }
  currentSprite = properties.gravity.y == 0 ? spriteStop : spriteJump
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

export default {
  draw,
  jump,
  properties,
  animatePlayer,
  handleMovement,
  updatePlayerPosition
}
