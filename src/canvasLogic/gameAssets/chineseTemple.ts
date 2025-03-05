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
  ';': 'rgba(0, 158, 0, 1)', // green
  ',': 'rgba(0, 130, 0, 1)', // darkgreen
  'n': 'rgba(255, 0, 0, 1)',
  '-': 'rgba(60, 48, 33, 0.76)',
  '_': 'rgba(194, 165, 92, 1)', // gray
  '*': 'rgba(255, 255, 255, 1)', // white
  '.': 'rgba(144, 300, 180, 1)', // lightgreen
  '~': 'rgba(211, 211, 211, 1)', // lightgray
  '`': 'rgba(255, 255, 255, 1)', // white
  ']': 'rgba(0, 128, 0, 1)', // green
  '[': 'rgba(0, 128, 0, 1)', // green
  'g': 'rgba(255, 255, 0, 1)',
  ':': 'rgba(255, 0, 0, 1)', // red
  '^': 'rgba(238, 130, 238, 1)', // violet
  'o': 'rgba(255, 255, 0, 1)', // yellow
  '+': 'rgba(255, 0, 0, 1)',
  '&': 'rgba(0, 130, 0, 1)',
  '@': 'rgba(0, 130, 0, 1)',
  '(': 'rgba(0, 130, 0, 1)',
  ')': 'rgba(0, 130, 0, 1)',
}

const colorMap: any = {
  '*': 'rgba(255, 255, 255, .5)', // white
  '.': 'rgba(144, 300, 180, .6)', // lightgreen
  '~': 'rgba(211, 211, 211, 1)', // lightgray
  '\\': 'rgba(255, 99, 71, .5)', // lightgray
  '/': 'rgba(255, 0, 0, .6)', // lightgray
  'n': 'rgba(255, 0, 0, .5)', // red
  '_': 'rgba(194, 165, 92, 0.5)', // gray
  '-': 'rgba(255, 255, 255, 1)', // white
  '=': 'rgba(151, 111, 111, 0.5)', // darkgray
  ';': 'rgba(26, 182, 26, 0.5)', // darkgreen
  ',': 'rgba(26, 182, 26, 0.5)', // darkgreen
  '`': 'rgba(255, 255, 255, 1)', // white
  ']': 'rgba(0, 128, 0, .35)', // green
  '|': 'rgba(110, 88, 31, 0.35)', // tomato
  '0': 'rgba(219, 136, 54, .6)',
  'W': 'rgba(243, 191, 54, .5)',
  'w': 'rgba(243, 191, 54, .5)',
  '[': 'rgba(0, 128, 0, .35)', // green
  'g': 'rgba(255, 255, 0, .25)',
  ':': 'rgba(26, 182, 26, 0.5)', // red
  '^': 'rgba(238, 130, 238, 1)', // violet
  'o': 'rgba(255, 255, 0, .25)', // yellow
  'x': 'rgba(255, 0, 0, .6)',
  'X': 'rgba(255, 0, 0, .5)',
  '+': 'rgba(255, 0, 0, .2)',
  'Y': 'rgba(108, 38, 38, 0.45)',
  'y': 'rgba(102, 56, 11, 0.85)',
  '&': 'rgba(0, 130, 0, .5)',
  '@': 'rgba(0, 130, 0, .5)',
  '(': 'rgba(0, 130, 0, .5)',
  ')': 'rgba(0, 130, 0, .5)',
}


const colorByTile = (rowIndex: number, columnIndex: number) => {
  const isTempleArea = getTempleArea(rowIndex, columnIndex)
  const isTemple = getTemple(rowIndex, columnIndex)
  const isMountain = getMountain(rowIndex, columnIndex)
  if (isTempleArea) return 'rgba(108, 85, 53, 0.85)'
  if (isMountain) return 'rgba(108, 85, 53, 0.85)'
  if(rowIndex < 10) return 'rgba(56, 57, 128, 0.35)'
  if(rowIndex >=  66) return 'rgba(21, 22, 72, 0.07)'
  if(rowIndex >=  10) return 'rgba(106, 233, 100, 0.51)'
  return 'rgb(0, 0, 0)'
}

const getMountain = (rowIndex: number, columnIndex: number) => {
  const mountainsCoordinates = [
    {
      minRow: 19,
      maxRow: 26,
      minColumn: 2,
      maxColumn: 19
    },
    {
      minRow: 32,
      maxRow: 39,
      minColumn: 7,
      maxColumn: 24
    },
    {
      minRow: 7,
      maxRow: 17,
      minColumn: 23,
      maxColumn: 40
    },
    {
      minRow: 2,
      maxRow: 9,
      minColumn: 49,
      maxColumn: 64
    },
    {
      minRow: 1,
      maxRow: 8,
      minColumn: 80,
      maxColumn: 97
    },
    {
      minRow: 8,
      maxRow: 17,
      minColumn: 94,
      maxColumn: 110
    },
    {
      minRow: 1,
      maxRow: 9,
      minColumn: 110,
      maxColumn: 126
    },
    {
      minRow: 16,
      maxRow: 29,
      minColumn: 114,
      maxColumn: 130
    },
    {
      minRow: 9,
      maxRow: 17,
      minColumn: 130,
      maxColumn: 146
    }
  ]

  return mountainsCoordinates.find((mountain) => {
    const difference = rowIndex >= mountain.minRow && rowIndex <= mountain.maxRow ? mountain.maxRow - rowIndex : -1
    return (rowIndex >= mountain.minRow && rowIndex <= mountain.maxRow + 1) && (columnIndex >= (mountain.minColumn + difference) && columnIndex <= (mountain.maxColumn - difference))
  })
}


const getTemple = (rowIndex: number, columnIndex: number) => {
  const maxRow = 61;
  const minRow = 23;
  const minColumn = 6;
  const maxColumn = 128
  const difference = rowIndex >= minRow && rowIndex <= maxRow ? maxRow - rowIndex : -1
  return (rowIndex >= minRow && rowIndex <= 65) && (columnIndex >= (minColumn + difference) && columnIndex <= (maxColumn - difference))
}

const getTempleArea = (rowIndex: number, columnIndex: number) => {
  const maxRow = 61;
  const minRow = 23;
  const minColumn = 6;
  const maxColumn = 128
  const difference = rowIndex >= minRow && rowIndex <= maxRow ? maxRow - rowIndex : -1
  return (rowIndex >= minRow && rowIndex <= 65) && (columnIndex >= (minColumn + difference) && columnIndex <= (maxColumn - difference))
}

const getTemplateMap = () => {
  return template.reduce((acc: any, line: any, rowIndex: number) => {
    const lines = line.split('').map((char: string, columnIndex: number) => {
      return {
        value: char,
        color: colorMap[char] || colorByTile(rowIndex, columnIndex),
        transparentFillColor: colorMap[char],
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
    case 'g':
      return randomBase * 5
    case '0':
      return randomBase * 25
    case '[':
      return randomBase * 20
    case ']':
      return randomBase * 5
    case '&':
      return randomBase * 5
    case '@':
      return randomBase * 7
    default:
      return randomBase * 10
  }
}
const animationByChar = (char: string) => {
  if (!shouldAnimate) return;
  if (['g', ':', ',', ';', '[', ']'].includes(char)) return "move"
  if (['@', '(', ')', '︵', '&'].includes(char)) return "move_brightup"
  if (['o', '-'].includes(char)) return "brightup"
  return "move"
}

const shouldBlock = (char: string) => {
  return ['Y', 'y', 'W', 'w', '0'].includes(char)
}

const shouldAnimate = (char: string) => {
  return ['(', ')', '&', '@', ';', ',', 'o', 'g'].includes(char)
}

const template = [
  `                                                                                        /\\                                                       `,
  `                                                        /\\                             /  \\                           /\\                       `,
  `                                                       /  \\                           /    \\                         /  \\                      `,
  `                                                      /    \\                         /      \\                       /    \\                     `,
  `                                                     /      \\                       /     *  \\                     /      \\                    `,
  `                                                    /     *  \\                     /          \\                   /     *  \\                   `,
  `                                                   /          \\                   /            \\                 /          \\                  `,
  `                                                  /            \\                 /   *          \\               /            \\                 `,
  `                                                 /   *          \\               /                \\             /   *          \\                `,
  `                               /\\               /                \\             /                  \\   /\\      /                \\         /\\ `,
  `                              /  \\             /                  \\                                  /  \\    /                  \\       /  \\ `,
  `                             /    \\                                                                 /    \\                             /    \\  `,
  `         ,,,,,,,            /      \\                                                               /      \\                           /      \\ `,
  `        ,,,,,,,,,          /     *  \\           ,:W;,;W;,.:;,          (&)                        /     *  \\                         /     *  \ `,
  `       ,,,,,,,,,,,        /          \\                                (@&@)                      /          \\                       /           `,
  `        ,,,,,,,,,        /            \\                              (@&@&@)                    /            \\                     /            `,
  `                        /   *          \\                            (@&@&@&@)                  /   *          \\                   /   *         `,
  `                       /                \\                          (&@&@&@&@&)                /                \\                 /              `,
  `          /\\          /                  \\                 ^      (@@&@&@@@&@@)              /                  \\               /              `,
  `         /  \\                                              |           W0W                                         ,:;;,;W;,W:;,                `,
  `        /    \\                           _________________|||__________0W0____________________                                                   `,
  `       /      \\                          |YyYyYyYyYyYyYyYy:::yYyYyYyYyYW0WyYyYYyYyYYyYyyYyYyY|                            /\\                   `,
  `      /     *  \\                         |YyYyYyYyYyYy._//_|_\\\\_.YyYYyY0W0YYyYyYyyYyYyYyYyYyy|    ,:W;,;,W;,.:;,         /  \\                 `,
  `     /          \\                        |YyYyYyYyYyYyoy||___||yoyYyYyYW0WyYyYYyYyYYyYyYyYyYy|                          /    \\                 `,
  `    /            \\    ,:;;,;W;,W:;,      |YyYyYyYyYyYyYy|| n ||yYyYyYyY0W0yYyYYyYyYYyYyYyYyYy|                         /      \\                `,
  `   /   *          \\                      |              ||___||    ;,;,W0W.:;,    (&@)       |                        /     *  \\              `,
  `  /                \\                    |            ._//_,_,_\\\\_. ,;,;,:;,.:;  (&@&@&)       |                      /          \\             `,
  ` /                  \\                  | ,:;.,;WWW;, o ||     || o             (@&@&@&@&)      |                    /            \\             `,
  `                                      |                ||  n  ||              (@@&@&@@@&@)      |    ,:W;,;W,;,    /   *          \\              `,
  `   ,:;;,;W;W,.:;,                    | (@)             ||_____||                   W0            |                /                \\          `,
  `                                    | (@&@)        ._///_,_,_,_\\\\\\_.               0W             |              /                  \\         `,
  `               /\\                  | (@&@&@)       o ||         || o               0W              |                                             `,
  `              /  \\                | (@&@&@&@)        || .  n  . ||   ,:;.,;0W0;,., W0   :;,.:;,;;:, |                                            `,
  `             /    \\              | (&@&@&@&@&)       ||_________||                 W0                |                                           `,
  `            /      \\            |      0W0        ._//__,_,_,_,__\\\\_.              0W                 |                          ,;0W;,        `,
  `   ,;0W;,  /     *  \\          |       W0W        o ||           || o              0W                  |                                         `,
  `          /          \\        |        0W0          ||  .  n  .  ||            ;,;,w0,.:;               |                                        `,
  `         /            \\      |     ;,;,W0W,.:,      ||           ||            :;;,0W:;,.:;,             |      ,:W;,;W;,.:;,                   `,
  `        /   *          \\    |     ,;;,;0W0;,.,,  ._///_,_,_,_,_,_\\\\\\_.        ,;,;,:;,.:;,                |                                   `,
  `       /                \\  |     ,;,;,:;,.:;,;.  o ||             || o                                     |                                     `,
  `      /                  \\|                        ||.   . n .   .||                                        |                                    `,
  `                         |                         ||             ||                      ;,;,;:;,.:,        |                      ,;0W;,        `,
  `                        |                       ._////_,_,_,_,_,_\\\\\\\\_.                  ,:;.,;g,g;,.,        |                               `,
  `                       |       ,:;,.:;,;;       o  ||             ||  o                 ,;,;,g;g.g;,;..        |                                  `,
  `       ,:;;,;0W;,.:;, |   .,;;,,:;,.:;,;;:,;       ||             ||                                            |     ,;0W;,                      `,
  `                     |                             || . .  n  . . ||                                             |                                `,
  `                    |                              ||             ||                                  :;,.:;,;;:, |                               `,
  `                   |    ..g..g..g..                ||_____________||                                               |                              `,
  `                  |                            ._////_,_,_,_,_,_,_\\\\\\\\\_.               ;,;,:;,.:;,                  |                         `,
  `       ,;0W;,    |                      ,:;,.: o ||      | - |      || o ;:.:;.   .:;,;;:,.:;,:;,.:;,:;,.:;          |                            `,
  `                |                                ||  n   |   |   n  ||                                                |               ,;0W;,      `,
  `               |    g::,:,.:;:,..;.,:;.g         ||      | * |      ||                                                 |                          `,
  `              |                             _____||______|___|______||____           ...g..g..g..                       |                         `,
  ` ,;0W;,      | /\\                       /\\               .....               /\\                      /\\                  |                    `,
  `            | //\\\\   ..g..g..g..g..g.  //\\\\ ....  ______       ______  .... //\\\\                    //\\\\  ...g..g..g..    |                   `,
  `           | ///\\\\\\                   ///\\\\\\      ______       ______      ///\\\\\\                  ///\\\\\\                  |                   `,
  `          |    W0                       w0                                   W0   g..g..g..g..g..    w0                 "   |                     `,
  `         |     0W                       0W       //=====       =====\\\\       0W                      0W                      |                  `,
  `        |  ;   0W       ,,,,,,,         w0____  //                   \\\\ ____ 0W    ,,,,,,,,,         w0                       |                 `,
  `       |       W0      ,,,,,,,,,        0W     //====   ,,,,,,,   ====\\\\     W0   ,,,,,,,,,,,        0W               .        |                `,
  `      |  ,;    W0  .  ,,,,,,,,,,,       w0    //       ,,,,,,,,,       \\\\\    W0                      w0                         |              `,
  `     |         0W      ,,,,,,,,,        0W   //====   ,,,,,,,,,,,   ====\\\\   0W   .            .     0W       ,              ^   |              `,
  `    |  ;  ;    0W ;               ,     w0  //         ,,,,,,,,,         \\\\\  0W        ;             w0                  ;        |            `,
  `    YyYyYyYyYyYW0YyYyYyYyYyYyYyYyYyYyYyY0W ///====                   ====\\\\\\ W0YyYyYyYyYyYyYyYyYyYyYy0WYyYyYyYyYyYyYyYyYyYyYyYyYyY|            `,
  `    YyYyYyYyYyY0WYyYyYyYyYyYyYyYyYyYyYyYw0//////////               \\\\\\\\\\\\\\\\\\\\\W0YyYyYyYyYyYyYyYyYyYyYyw0YyYyYyYyYyYyYyYyYyYyYyYyYyY|           `,
  `    YyYyYyYyYyYW0YyYyYyYyYyYyYyYyYyYyYyY0W//////////               \\\\\\\\\\\\\\\\\\\\0WYyYyYyYyYyYyYyYyYyYyYy0WYyYyYyYyYyYyYyYyYyYyYyYyYyY|           `,
  `    YyYyYyYyYyY0WYyYyYyYyYyYyYyYyYyYyYyYW0//////////               \\\\\\\\\\\\\\\\\\\\0WYyYyYyYyYyYyYyYyYyYyYyW0YyYyYyYyYyYyYyYyYyYyYyYyYyY|     `,
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