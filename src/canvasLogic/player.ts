import CanvasObject from "@/interfaces/CanvasObject"

const canvasObject: CanvasObject = {
  canvas: undefined,
  canvasElement: undefined
}

const properties = {
  height: 100,
  width: 100,
  movementSpeed: 12,
  jumpHeight: 18,
  canJump: true,
  gravity: {
    coeficient: 1,
    x: 0,
    y: 0
  },
  position: {
    x: 100,
    y: 100
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
  playerPosition.bottom = properties.position.y + properties.height
  properties.gravity.y = height >= (playerPosition.bottom + properties.gravity.y) ? properties.gravity.y + properties.gravity.coeficient : 0
  properties.canJump = height <= (playerPosition.bottom + properties.gravity.y)
  return properties.position.y
}

export const animatePlayer = () => {
  if (!canvasObject.canvas || !canvasObject.canvasElement) return;
  canvasObject.canvas.fillStyle = 'blue'
  canvasObject.canvas.fillRect(properties.position.x, properties.position.y, properties.width, properties.height)
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
    return properties.gravity.x = properties.movementSpeed
  } else if (config.keys.ArrowLeft.pressed) {
    return properties.gravity.x = -properties.movementSpeed
  }
}

export const jump = (off = false) => {
  const height = (canvasObject.canvasElement?.height || 0)
  if (!properties.canJump) return;
  if (properties.gravity.y == 0 && height <= playerPosition.bottom) {
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
