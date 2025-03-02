import CanvasObject from '../interfaces/CanvasObject'
import Player from './player'
import config from './config'
import { setupEventListeners } from './eventListeners'


const player = Player
const heightCoeficient = 18
const widthCoeficient = 8

const canvasObject: CanvasObject = {
  canvas: undefined,
  canvasElement: undefined
}


const colorMap: any = {
  '*': 'white',
  '.': 'lightgreen',
  '~': 'lightgray',
  '\\': 'lightgray',
  '/': 'lightgray',
  'n': 'red',
  '_': 'gray',
  '-': 'white',
  '=': 'darkgray',
  ';': 'green',
  ',': 'darkgreen',
  '`': 'white',
  ']': 'green',
  '|': 'tomato',
  '[': 'green',
  '': 'yellow',
  ':': 'red',
  '^': 'violet',
  'o': 'yellow',
}

const drawTemple = (scale: number) => {
  if (!canvasObject?.canvas || !canvasObject.canvasElement) return

  let temple = [
    `                                           |`,
    `                                           :`,
    `                                        ._/_\\_.`,
    `                                         |   |   `,
    `                                         | n |`,
    `                                         |   |`,
    `                                       ._/_,_\\_.`,
    `                                       -.|   |.- `,
    `                                         |.n.|`,
    `                                         |   |`,
    `                                      ._/_,_,_\\_.`,
    `                                      ,-|     |-,`,
    `                                        |..n..|`,
    `                                        |     |`,
    `                                     ._/_,_,_,_\\_.`,
    `                                     ,-|       |-,`,
    `                                       |...n...|`,
    `                                       |       |`,
    `                                    ._/_,_,_,_,_\\_.`,
    `                                      |         | `,
    `                                      |....n....|`,
    `                                      |         |`,
    `                                   ._/_,_,_,_,_,_\\_.`,
    `                                     |           |`,
    `                                     |.....n.....|`,
    `                                     |           |  `,
    `                                  ._/_,_,_,_,_,_,_\\_. `,
    `          \`,  '.  \`.  ".  \`,  '.  |       ---       |  ",  \`.  \`,  \`.  \`,  ',`,
    `                                  |    n   _   n    |`,
    `                            ^     |      | . |      |     ^`,
    `     :,.:;..;;..;;.,:;,.:,o_^_____|______|_._|______|_____^_o;,.:;.,;;,,:;,.:;,;;:`,
    `     ..o..o..o..o..o..o.o..o...   //_______________\\\\  ..o..o..o..o..o..o.o..o...`,
    `                                 //=================\\\\\\`,
    `     ][  ][  ][  ][  |_|______  ///__________________\\\\\\  _______|_|  ][  ][  ][  ][`,
    `    /                |         ///====================\\\\\\\\         |                \\`,
    `   /                 |        ///______________________\\\\\\\\        |                 \\`,
    `  /__________________|___    ////=======================\\\\\\\\\\   ___|__________________\\`,
    `                           /////_________________________\\\\\\\\\\\\`
  ]


  fillCanvas(temple, scale)
  const templeWidth = widthCoeficient * scale * Math.max(...temple.map(line => line.length));
  const templeHeight = heightCoeficient * scale * temple.length;

  if (canvasObject.canvasElement.width < templeWidth) {
    canvasObject.canvasElement.width = templeWidth
  }
  if (canvasObject.canvasElement.height < templeHeight) {
    canvasObject.canvasElement.height = templeHeight
  }
}

export const animateLevel = () => {
  if (!canvasObject.canvas || !canvasObject.canvasElement) return;
  if (typeof window !== undefined) window.requestAnimationFrame(animateLevel)
  // Setup background
  canvasObject.canvas.fillStyle = 'black'
  canvasObject.canvas.fillRect(0, 0, canvasObject.canvasElement.width, canvasObject.canvasElement.height)
  drawTemple(4)
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

  animateLevel()
  setupEventListeners(player, config)
}

const fillCanvas = (lines: string[], scale: number) => {
  const repeat = Math.round(scale / 2)
  if (!canvasObject?.canvas || !canvasObject.canvasElement) return
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let scaledLine = '';
    for (let j = 0; j < line.length; j++) {
        scaledLine += line[j].repeat(2);
    }
    for (let k = 0; k < scaledLine.length; k++) {
      for (let j = 0; j < scale; j++) {
      let char = scaledLine[k];
        canvasObject.canvas.fillStyle = colorMap[char] || 'blue';
        canvasObject.canvas.font = `${widthCoeficient * scale}px monospace`;
        canvasObject.canvas.fillText(char, k * (widthCoeficient + scale), heightCoeficient * i * scale + 10 * j);
      }
    }
  }
}
