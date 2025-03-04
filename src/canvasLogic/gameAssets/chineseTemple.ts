import GameAsset from "@/interfaces/GameAsset"

// cuadro de 48x48
// cada cuuadro contiene 4 caracteres
/*

  Aquí hay unos ejemplos de cuadros

  Yy
  yY

  (&
  @&

*/

/*

  Se divide el array de abajo en batches de 2 characteres por row

  cada batch contiene lo siguiente

  {
    value: string,
    block: boolean,
    color: string,
    animation: {
      name: string,
      interval: number,
      value: string,
      color: string
    }
  }

*/

const fillColorMap: any = {
  '\\': 'rgba(255, 99, 71, .25)', // lightgray
  '/': 'rgba(255, 99, 71, .25', // lightgray
  '|': 'rgba(255, 0, 0, .2)',
  '=': 'gray',
  '0': 'rgba(243, 191, 54, .3)',
  'W': 'rgba(219, 136, 54, .3)',
  'Y': 'rgba(219, 136, 54, .6)',
  'y': 'rgba(219, 136, 54, .3)',
  'x': 'rgba(255, 0, 0, .4)',
  'X': 'rgba(255, 0, 0, .4)',
  ';': 'rgba(0, 158, 0, .25)', // green
  ',': 'rgba(0, 100, 0, .25)', // darkgreen
}

const colorMap: any = {
  '*': 'rgba(255, 255, 255, 1)', // white
  '.': 'rgba(144, 300, 180, .6)', // lightgreen
  '~': 'rgba(211, 211, 211, 1)', // lightgray
  '\\': 'rgba(255, 99, 71, .7)', // lightgray
  '/': 'rgba(255, 99, 71, 1)', // lightgray
  'n': 'rgba(255, 0, 0, 1)', // red
  '_': 'rgba(128, 128, 128, 1)', // gray
  '-': 'rgba(255, 255, 255, 1)', // white
  '=': 'rgba(169, 169, 169, 1)', // darkgray
  ';': 'rgba(0, 158, 0, 1)', // green
  ',': 'rgba(0, 100, 0, 1)', // darkgreen
  '`': 'rgba(255, 255, 255, 1)', // white
  ']': 'rgba(0, 128, 0, 1)', // green
  '|': 'rgba(243, 191, 54, .3)', // tomato
  '0': 'rgba(219, 136, 54, .6)',
  'W': 'rgba(243, 191, 54, 1)',
  'w': 'rgba(243, 191, 54, 1)',
  '[': 'rgba(0, 128, 0, .4)', // green
  '': 'rgba(255, 255, 0, 1)', // yellow
  ':': 'rgba(255, 0, 0, 1)', // red
  '^': 'rgba(238, 130, 238, 1)', // violet
  'o': 'rgba(255, 255, 0, 1)', // yellow
  'x': 'rgba(255, 0, 0, .6)',
  'X': 'rgba(255, 0, 0, .5)',
  '+': 'rgba(255, 0, 0, .2)',
  'Y': 'rgba(219, 136, 54, .6)',
  'y': 'rgba(137, 190, 137, .75)',
  '&': 'rgba(0, 130, 0, .5)',
  '@': 'rgba(0, 130, 0, 1)',
  '(': 'rgba(0, 130, 0, 1)',
  ')': 'rgba(0, 130, 0, 1)',
}


const colorByTile = (rowIndex: number, columnIndex: number) => {
  const maxRow = 61;
  const minRow = 24;
  const minColumn = 6;
  const maxColumn = 128
  const difference = rowIndex >= minRow && rowIndex <= maxRow ? maxRow - rowIndex : -1

  if ((rowIndex >= minRow && rowIndex <= 65) && (columnIndex >= (minColumn + difference) && columnIndex <= (maxColumn - difference)))
    return 'rgba(67, 50, 24, 0.85)'
  return 'rgb(34, 31, 67)'
}

const getTemplateMap = () => {
  return template.reduce((acc: any, line: any, rowIndex: number) => {
    const lines = line.split('').map((char: string, columnIndex: number) => {
      return {
        value: char,
        color: colorMap[char] || colorByTile(rowIndex, columnIndex),
        fillColor: fillColorMap[char] || colorByTile(rowIndex, columnIndex),
        block: shouldBlock(char),
        rowNumber: rowIndex,
        columnNumber: columnIndex,
        animation: shouldAnimate(char) ? {
          name: "move",
          interval: 1500,
          value: char,
          color: colorMap[char] || colorByTile(rowIndex, columnIndex)
        } : null
      }
    })
    return {...acc, [rowIndex]: lines}
  }, {})
}


const shouldBlock = (char: string) => {
  return ['/', '\\', 'Y', 'y', 'W', 'w', '0'].includes(char)
}

const shouldAnimate = (char: string) => {
  return ['(', ')', '&', '@'].includes(char)
}

const template = [
  `                                                                                        /\\                                                      `,
  `                                                        /\\                            /  \\                           /\\                       `,
  `                                                       /  \\                          /    \\                         /  \\                      `,
  `                                                      /    \\                        /      \\                       /    \\                     `,
  `                                                     /      \\                      /     *  \\                     /      \\                    `,
  `                                                    /     *  \\                    /          \\                   /     *  \\                   `,
  `                                                   /          \\                  /            \\                 /          \\                  `,
  `                                                  /            \\                /   *          \\               /            \\                 `,
  `                                                 /   *          \\              /                \\             /   *          \\                `,
  `                               /\\               /                \\            /                  \\   /\\      /                \\         /\\ `,
  `                              /  \\             /                  \\                                 /  \\    /                  \\       /  \\ `,
  `                             /    \\                                                                /    \\                             /    \\  `,
  `                            /      \\                                                              /      \\                           /      \\ `,
  `                           /     *  \\           ,:;;,;0W;,.:;,        (&)                        /     *  \\                         /     *  \ `,
  `                          /          \\                               (@&@)                      /          \\                       /           `,
  `                         /            \\                             (@&@&@)                    /            \\                     /            `,
  `                        /   *          \\                           (@&@&@&@)                  /   *          \\                   /   *         `,
  `                       /                \\                         (&@&@&@&@&)                /                \\                 /              `,
  `          /\\          /                  \\                 ^     (@@&@&@@@&@@)              /                  \\               /              `,
  `         /  \\                                              |          W0                                         ,:;;,;0W;,.:;,                 `,
  `        /    \\                           _________________|||_________0W_____________________                                                   `,
  `       /      \\                          |YyYyYyYyYyYyYyYy:::yYyYyYyYyW0YyYyYyYyYyYyYyyYyYyY|                             /\\                   `,
  `      /     *  \\                         |YyYyYyYyYyYy._//___\\\\_.YyYyY0WyYyYyYyYyYyYyYyYyYyy|    ,:;;,;0W;,.:;,          /  \\                `,
  `     /          \\                        |YyYyYyYyYyYyYy||___||yYyYyYyW0YyYyYyYyYyYyYyYyYyYy|                           /    \\                 `,
  `    /            \\    ,:;;,;0W;,.:;,     |YyYyYyYyYyYyYy|| n ||yYyYyYy0WYyYyYyYyYyYyYyYyYyYy|                          /      \\                `,
  `   /   *          \\                      |              ||___||   ;,;,W0,.:;,                |                        /     *  \\               `,
  `  /                \\                    |            ._//_,_,_\\\\_.,;,;,:;,.:;,  (&@&@&@)      |                      /          \\            `,
  ` /                  \\                  |             -.||     ||.-             (&@&@&@&@)      |                    /            \\             `,
  `                                      |                ||--n--||              (@@&@&@@@&@)      |    ,:;;,;0W;,    /   *          \\             `,
  `   ,:;;,;0W;,.:;,                    |                 ||_____||                   W0            |                /                \\            `,
  `                                    | (@&@)        ._///_,_,_,_\\\\\\_.               0W             |              /                  \\        `,
  `               /\\                  | (@&@&@)       ,-||         ||-,               0W              |                                            `,
  `              /  \\                | (@&@&@&@)        ||--- n ---||                 W0               |                                           `,
  `             /    \\              | (&@&@&@&@&)       ||_________||                 W0                |                                          `,
  `            /      \\            |      0W         ._//__,_,_,_,__\\\\_.              0W                 |                                       `,
  `           /     *  \\          |       W0         ,-||           ||-,              0W                  |                                        `,
  `          /          \\        |        0W           ||---- n ----||            ;,;,w0,.:;,              |                                       `,
  `         /            \\      |     ;,;,W0,.:;,      ||___________||           ,:;;,0W:;,.:;,             |      ,:;;,;0W;,.:;,                  `,
  `        /   *          \\    |    ,:;;,;0W;,.:;,  ._///_,_,_,_,_,_\\\\\\_.        ,;,;,:;,.:;,                |                                  `,
  `       /                \\  |     ,;,;,:;,.:;,      ||             ||                                       |                                    `,
  `      /                  \\                         ||----- n -----||                                        |                                   `,
  `                         |                         ||_____________||                                         |                                   `,
  `                        |                       ._////_,_,_,_,_,_\\\\\\\\_.                ;,;,:;,.:;,            |                              `,
  `  ,:;;,;0W;,.:;,       |                           ||             ||                                           |                                 `,
  `                      |                            ||----- n -----||                                            |                                `,
  `                     |       ,:;,.:;,;;            ||             ||                                             |                               `,
  `                    |  .,;;,,:;,.:;,;;:,;          ||_____________||                                              |                              `,
  `                   |                           ._////_,_,_,_,_,_,_\\\\\\\\\_.               ;,;,:;,.:;,                 |                        `,
  `                  |                      ,:;,.:  ||      | - |      ||_o;|.:;.    .:;,;;:,.:;,:;,.:;,:;,.:;         |                            `,
  `                 |                               ||  n   |   |  n   ||                                               |                           `,
  `                |                          ^     ||      | * |      ||    ^                                           |                          `,
  `               |  o;::,:,.:;:,..;.,:;,.,,o_^_____||______|___|______||____^_o;.:;.,;;,;;:,.:;,|,:;,.:;,:;,.:;,;;:,.:   |                         `,
  `              | /\\                      /\\       || //   .....  \\\\  ||      /\\                      /\\                  |                  `,
  `             | //\\\\  .o.o..o...        //\\\\  ....//_________________\\\\.... //\\\\   ...o..o..o..     //\\\\  ...o..o..o..    |             `,
  `            | ///\\\\\\                  ///\\\\\\     ||=================||    ///\\\\\\                  ///\\\\\\                  |          `,
  `           |    W0   ..o..o..o..o..o.   w0....  //                  \\\\ .o.o W0   o..o..o.o..o..     w0                 "   |                   `,
  `          |     0W                      0W      ||===================||     0W                      0W                      |                    `,
  `         |  [   0W [[]][]][]][]][][][]  w0____ //                    \\\\ ____0W ][]][]][]][]][]][]   w0 ][][]                 |                 `,
  `        |       W0            ,         0W    |||=====================|||   W0         ,            0W               .        |                  `,
  `       |  []    W0  .                   w0   ///                      \\\\\\\   W0                      w0                         |             `,
  `      |         0W       .              0W   |||=======================|||  0W   .            .     0W       ,              ^   |                `,
  `     |  ;  ;    0W ;               ,    w0  ///                        \\\\\\\  0W        ;             w0                  ;        |           `,
  `     YyYyYyYyYyYW0YyYyYyYyYyYyYyYyYyYyYy0W  |||=========================||| W0YyYyYyYyYyYyYyYyYyYyYy0WYyYyYyYyYyYyYyYyYyYyYyYyYyY|               `,
  `     YyYyYyYyYyY0WYyYyYyYyYyYyYyYyYyYyYyw0 ////                         \\\\\\\ W0YyYyYyYyYyYyYyYyYyYyYyw0YyYyYyYyYyYyYyYyYyYyYyYyYyY|           `,
  `     YyYyYyYyYyYW0YyYyYyYyYyYyYyYyYyYyYy0W||||===========================|||0WYyYyYyYyYyYyYyYyYyYyYy0WYyYyYyYyYyYyYyYyYyYyYyYyYyY|               `,
  `     YyYyYyYyYyY0WYyYyYyYyYyYyYyYyYyYyYyW0////                           \\\\\\0WYyYyYyYyYyYyYyYyYyYyYyW0YyYyYyYyYyYyYyYyYyYyYyYyYyY|            `,
  ``,
  `     -        -        -        -        -        -        -        -        -        -        -        -        -        -        -       -      `,
  `                                                                                                                                                  `,
  `XxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXx`,
  `XxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXx`,
]


const asset: GameAsset = {
  template,
  templateMap: getTemplateMap(),
  colorMap
}

export default asset