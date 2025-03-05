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
  '\\': 'rgba(255, 99, 71, 1)', // lightgray
  '/': 'rgba(255, 99, 71, 1', // lightgray
  '|': 'rgb(246, 180, 14)', // tomato
  '=': 'rgba(252, 247, 241, 0.85)',
  '0': 'rgba(243, 191, 54, 1)',
  'W': 'rgba(243, 191, 54, 1)',
  'w': 'rgba(243, 191, 54, 1)',
  'Y': 'rgb(228, 24, 24)',
  'y': 'rgba(219, 136, 54, 1)',
  'x': 'rgba(255, 0, 0, .1)',
  'X': 'rgba(255, 0, 0, .1)',
  ';': 'rgba(0, 158, 0, .1)', // green
  ',': 'rgba(0, 100, 0, .1)', // darkgreen
  'n': 'rgba(255, 0, 0, 1)',
  '-': 'rgba(108, 85, 53, 0.85)',
  '_': 'rgba(194, 165, 92, 1)', // gray
  '*': 'rgba(255, 255, 255, 1)', // white
  '.': 'rgba(144, 300, 180, 1)', // lightgreen
  '~': 'rgba(211, 211, 211, 1)', // lightgray
  '`': 'rgba(255, 255, 255, 1)', // white
  ']': 'rgba(0, 128, 0, 1)', // green
  '': 'rgba(255, 255, 0, 1)', // yellow
  ':': 'rgba(255, 0, 0, 1)', // red
  '^': 'rgba(238, 130, 238, 1)', // violet
  'o': 'rgba(255, 255, 0, 1)', // yellow
  '+': 'rgba(255, 0, 0, 1)',
  '&': 'rgba(0, 130, 0, 1)',
  '@': 'rgba(0, 130, 0, 1)',
  '(': 'rgba(0, 130, 0, 1)',
  ')': 'rgba(0, 130, 0, 1)',
  '︵': 'rgba(0, 130, 0, 1)',
}

const colorMap: any = {
  '*': 'rgba(255, 255, 255, .5)', // white
  '.': 'rgba(144, 300, 180, .6)', // lightgreen
  '~': 'rgba(211, 211, 211, 1)', // lightgray
  '\\': 'rgba(255, 99, 71, .5)', // lightgray
  '/': 'rgba(255, 0, 0, .6)', // lightgray
  'n': 'rgba(255, 0, 0, .5)', // red
  '_': 'rgba(194, 165, 92, 0.85)', // gray
  '-': 'rgba(255, 255, 255, 1)', // white
  '=': 'rgba(151, 111, 111, 0.82)', // darkgray
  ';': 'rgba(0, 158, 0, 1)', // green
  ',': 'rgba(0, 100, 0, 1)', // darkgreen
  '`': 'rgba(255, 255, 255, 1)', // white
  ']': 'rgba(0, 128, 0, 1)', // green
  '|': 'rgba(110, 88, 31, 0.35)', // tomato
  '0': 'rgba(219, 136, 54, .6)',
  'W': 'rgba(243, 191, 54, .5)',
  'w': 'rgba(243, 191, 54, .5)',
  '[': 'rgba(0, 128, 0, .4)', // green
  '': 'rgba(255, 255, 0, 1)', // yellow
  ':': 'rgba(255, 0, 0, 1)', // red
  '^': 'rgba(238, 130, 238, 1)', // violet
  'o': 'rgba(255, 255, 0, 1)', // yellow
  'x': 'rgba(255, 0, 0, .6)',
  'X': 'rgba(255, 0, 0, .5)',
  '+': 'rgba(255, 0, 0, .2)',
  'Y': 'rgba(108, 38, 38, 0.45)',
  'y': 'rgba(102, 56, 11, 0.85)',
  '&': 'rgba(0, 130, 0, .5)',
  '@': 'rgba(0, 130, 0, 1)',
  '(': 'rgba(0, 130, 0, .8)',
  ')': 'rgba(0, 130, 0, .8)',
  '︵': 'rgba(0, 130, 0, .8)',
}


const colorByTile = (rowIndex: number, columnIndex: number) => {
  const maxRow = 61;
  const minRow = 23;
  const minColumn = 6;
  const maxColumn = 128
  const difference = rowIndex >= minRow && rowIndex <= maxRow ? maxRow - rowIndex : -1

  if ((rowIndex >= minRow && rowIndex <= 65) && (columnIndex >= (minColumn + difference) && columnIndex <= (maxColumn - difference)))
    return 'rgba(108, 85, 53, 0.85)'
  return 'rgb(0, 0, 0)' //'rgb(34, 31, 67)'
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
          name: animationByChar(char),
          interval: intervalByChar(char),
          value: char,
          color: colorMap[char] || colorByTile(rowIndex, columnIndex)
        } : null
      }
    })
    return {...acc, [rowIndex]: lines}
  }, {})
}

const intervalByChar = (char: string) => {
  const randomBase = Math.floor(Math.random() * 9) + 2; // Generates a number between 2 and 10
  switch(char) {
    default:
      return randomBase * 30
  }
}
const animationByChar = (char: string) => {
  if (!shouldAnimate) return;
  switch(char) {
    case '@':
      return "move_brightup"
    case ';':
      return "move"
    case ':':
      return "move"
    case '.':
      return "move"
    case 'o':
      return "move_brightup"
    case '(':
      return "move_brightup"
    case ')':
      return "move_brightup"
    case '︵':
      return "move_brightup"
    case '&':
      return "move_brightup"
    case '/':
      return 'brightup'
    case '\\':
      return 'brightup'
    case '\\':
      return '*'
    case '-':
      return "move_brightup_block"
    default:
      'move'
  }
}

const shouldBlock = (char: string) => {
  return ['Y', 'y', 'W', 'w', '0'].includes(char)
}

const shouldAnimate = (char: string) => {
  return ['(', ')', '&', '@', ';', '-', '[', ']', 'o'].includes(char)
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
  `         /  \\                                              |          W0W                                         ,:;;,;0W;,.:;,                `,
  `        /    \\                           _________________|||_________0W0____________________                                                   `,
  `       /      \\                          |YyYyYyYyYyYyYyYy:::yYyYyYyYyW0WyYyYYyYyYyYyYyyYyYyY|                            /\\                   `,
  `      /     *  \\                         |YyYyYyYyYyYy._//___\\\\_.YyYyY0W0YYyYyYyYyYyYyYyYyYyy|    ,:;;,;0W;,.:;,         /  \\                `,
  `     /          \\                        |YyYyYyYyYyYyYy||___||yYyYyYyW0WyYyYYyYyYyYyYyYyYyYy|                          /    \\                 `,
  `    /            \\    ,:;;,;0W;,.:;,     |YyYyYyYyYyYyYy|| n ||yYyYyYy0WOyYyYYyYyYyYyYyYyYyYy|                         /      \\                `,
  `   /   *          \\                      |              ||___||   ;,;,W0W.:;,     ︵︵︵        |                        /     *  \\             `,
  `  /                \\                    |            ._//_,_,_\\\\_.,;,;,:;,.:;   ︵(@&@&)       |                      /          \\            `,
  ` /                  \\                  | ,:;.,;0W0;, -.||     ||.-             ︵(&@&@&@&)      |                    /            \\             `,
  `                                      |                ||  n  ||              (@@&@&@@@&@)      |    ,:;;,;0W;,    /   *          \\              `,
  `   ,:;;,;0W;,.:;,                    |︵︵︵︵             ||_____||                   W0            |                /                \\          `,
  `                                    | (@&@)        ._///_,_,_,_\\\\\\_.               0W             |              /                  \\         `,
  `               /\\                  | (@&@&@)       ,-||         ||-,               0W              |                                             `,
  `              /  \\                | (@&@&@&@)        || -  n  - ||   ,:;.,;0W0;,., W0               |                                            `,
  `             /    \\              | (&@&@&@&@&)       ||_________||                 W0                |                                           `,
  `            /      \\            |      0W0        ._//__,_,_,_,__\\\\_.              0W                 |                                        `,
  `           /     *  \\          |       W0W        ,-||           ||-,              0W                  |                                         `,
  `          /          \\        |        0W0          ||  -  n  -  ||            ;,;,w0,.:;,              |                                        `,
  `         /            \\      |     ;,;,W0W,.:,      ||___________||           ,:;;,0W:;,.:;,             |      ,:;;,;0W;,.:;,                   `,
  `        /   *          \\    |    ,:;;,;0W0;,.,,  ._///_,_,_,_,_,_\\\\\\_.        ,;,;,:;,.:;,                |                                   `,
  `       /                \\  |     ,;,;,:;,.:;,;..   ||             ||                                       |                                     `,
  `      /                  \\                         ||-   - n -   -||                                        |                                    `,
  `                          |                        ||_____________||                      ;,;,;:;,.:,        |                                    `,
  `                         |                      ._////_,_,_,_,_,_\\\\\\\\_.                  ,:;.,;0W0;,.,        |                               `,
  `  ,:;;,;0W;,.:;,        |                          ||             ||                    ,;,;,0;W.0;,;..        |                                  `,
  `                                                   ||             ||                                            |                                `,
  `                      |                            || - -  n  - - ||                                             |                                `,
  `                     |       ,:;,.:;,;;            ||             ||                                              |                               `,
  `                    |  .,;;,,:;,.:;,;;:,;          ||_____________||                                               |                              `,
  `                   |                           ._////_,_,_,_,_,_,_\\\\\\\\\_.               ;,;,:;,.:;,                  |                        `,
  `                  |                      ,:;,.:  ||      | - |      ||_o;|.:;.    .:;,;;:,.:;,:;,.:;,:;,.:;          |                            `,
  `                 |                               ||  n   |   |   n  ||                                                |                           `,
  `                |                                ||      | * |      ||                                                 |                          `,
  `               |   o::,:,.:;:,..;.,:;.o     _____||______|___|______||____                                 :;,.:;,;;:,.:|                         `,
  `              | /\\                      /\\               .....               /\\                      /\\                  |                    `,
  `             | //\\\\    ..o..o..o..     //\\\\ ....  ______       ______  .... //\\\\   ...o..o..o..     //\\\\  ...o..o..o..    |               `,
  `            | ///\\\\\\                  ///\\\\\\      ______       ______      ///\\\\\\                  ///\\\\\\                  |          `,
  `           |    W0   ..o..o..o..o..o.   w0                                   W0   o..o..o.o..o..     w0                 "   |                     `,
  `          |     0W                      0W       //=====       =====\\\\       0W                      0W                      |                  `,
  `         |  [   0W [[]][]][]][]][][][]  w0____  //                   \\\\ ____ 0W ][]][]][]][]][]][]   w0 ][][]                 |                 `,
  `        |       W0            ,         0W     //====             ====\\\\     W0         ,            0W               .        |                `,
  `       |  []    W0  .                   w0    //                       \\\\\    W0                      w0                         |              `,
  `      |         0W       .              0W   //====                 ====\\\\   0W   .            .     0W       ,              ^   |              `,
  `     |  ;  ;    0W ;               ,    w0  //                           \\\\\  0W        ;             w0                  ;        |            `,
  `     YyYyYyYyYyYW0YyYyYyYyYyYyYyYyYyYyYy0W ///====                   ====\\\\\\ W0YyYyYyYyYyYyYyYyYyYyYy0WYyYyYyYyYyYyYyYyYyYyYyYyYyY|            `,
  `     YyYyYyYyYyY0WYyYyYyYyYyYyYyYyYyYyYyw0//////////              \\\\\\\\\\\\\\\\\\\\\\\W0YyYyYyYyYyYyYyYyYyYyYyw0YyYyYyYyYyYyYyYyYyYyYyYyYyY|   `,
  `     YyYyYyYyYyYW0YyYyYyYyYyYyYyYyYyYyYy0W//////////              \\\\\\\\\\\\\\\\\\\\\\0WYyYyYyYyYyYyYyYyYyYyYy0WYyYyYyYyYyYyYyYyYyYyYyYyYyY|    `,
  `     YyYyYyYyYyY0WYyYyYyYyYyYyYyYyYyYyYyW0//////////              \\\\\\\\\\\\\\\\\\\\\\0WYyYyYyYyYyYyYyYyYyYyYyW0YyYyYyYyYyYyYyYyYyYyYyYyYyY|    `,
  `                                                                                                                                                  `,
  `                                                                                                                                                  `,
  `                                                                                                                                                  `,
  `                                                                                                                                                  `,
  `     -        -        -        -        -        -        -        -        -        -        -        -        -        -        -       -      `,
  `                                                                                                                                                  `,
  `                                                                                                                                                  `,
  `                                                                                                                                                  `,
  `XxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXx`,
  `XxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXx`,
  `XxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXx`,
  `XxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXx`,
  `XxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXx`,
  `XxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXxYyXyYxYxXyXx`,
]


const asset: GameAsset = {
  template,
  templateMap: getTemplateMap(),
  colorMap
}

export default asset