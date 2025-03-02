import CanvasObject from "@/interfaces/CanvasObject"

const canvasObject: CanvasObject = {
  canvas: undefined,
  canvasElement: undefined
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
  height: 50,
  width: 50,
  movementSpeed: 10,
  jumpHeight: 15,
  canJump: true,
  gravity: {
    coeficient: 1,
    x: 0,
    y: 0
  },
  position: {
    x: 50,
    y: 50
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
  playerPosition.bottom = properties.position.y + (properties.height * 2.5)
  properties.gravity.y = height >= (playerPosition.bottom + properties.gravity.y) ? properties.gravity.y + properties.gravity.coeficient : 0
  properties.canJump = height <= (playerPosition.bottom + properties.gravity.y)
  return properties.position.y
}

export const animatePlayer = () => {
  if (!canvasObject.canvas || !canvasObject.canvasElement) return;
  canvasObject.canvas.fillStyle = 'blue'
  drawPlayer(currentSprite || spriteStop, 1)
}

const drawPlayer = (sprite: string, scale: number) => {
  if (!canvasObject?.canvas || !canvasObject.canvasElement) return;
  let lines = sprite.split('\n');
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    for (let j = 0; j < line.length; j++) {
      let char = line[j];
      canvasObject.canvas.fillStyle = 'white';
      canvasObject.canvas.font = `${25 * scale}px monospace`;
      canvasObject.canvas.fillText(
        char,
        properties.position.x + j * 10 * scale,
        properties.position.y + (i * 5) * 5 * scale
      );
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
