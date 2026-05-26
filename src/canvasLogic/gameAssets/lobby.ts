import GameAsset, { CellData } from "@/interfaces/GameAsset"

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

const fillColorMap: Record<string, string> = {
}

const colorMap: Record<string, string> = {
  '8': 'rgba(83, 81, 205, 0.9)'
}


const colorByTile = (rowIndex: number, columnIndex: number) => {
  const isMountain = getMountain(rowIndex, columnIndex)
  const isTempleArea = getLobbyArea(rowIndex, columnIndex)
  const isTemple = getLobby(rowIndex, columnIndex)
  const isTempleDoor = getLobbyDoor(rowIndex, columnIndex)
  if (isMountain) return 'rgba(0, 0, 0, .4)'
  if (isTempleDoor) return 'rgba(0, 0, 0, .4)'
  if (isTemple) return 'rgba(0, 0, 0, .4)'
  if (isTempleArea) return 'rgba(0, 0, 0, .4)'
  return 'rgba(0, 0, 0, .4)'
}

const getMountain = (rowIndex: number, columnIndex: number) => {
  const mountainsCoordinates = [
    {
      minRow: 20,
      maxRow: 27,
      minColumn: 2,
      maxColumn: 19
    },
    {
      minRow: 33,
      maxRow: 40,
      minColumn: 7,
      maxColumn: 24
    },
    {
      minRow: 8,
      maxRow: 18,
      minColumn: 23,
      maxColumn: 40
    },
    {
      minRow: 3,
      maxRow: 10,
      minColumn: 49,
      maxColumn: 64
    },
    {
      minRow: 2,
      maxRow: 9,
      minColumn: 80,
      maxColumn: 97
    },
    {
      minRow: 9,
      maxRow: 18,
      minColumn: 94,
      maxColumn: 110
    },
    {
      minRow: 2,
      maxRow: 10,
      minColumn: 110,
      maxColumn: 126
    },
    {
      minRow: 17,
      maxRow: 30,
      minColumn: 114,
      maxColumn: 130
    },
    {
      minRow: 10,
      maxRow: 18,
      minColumn: 130,
      maxColumn: 146
    }
  ]

  return mountainsCoordinates.find((mountain) => {
    const difference = rowIndex >= mountain.minRow && rowIndex <= mountain.maxRow ? mountain.maxRow - rowIndex : -1
    return (rowIndex >= mountain.minRow && rowIndex <= mountain.maxRow + 1) && (columnIndex >= (mountain.minColumn + difference) && columnIndex <= (mountain.maxColumn - difference))
  })
}

const getLobby = (rowIndex: number, columnIndex: number) => {
  const templeCoordinates = [
    {
      minRow: 21,
      maxRow: 31,
      minColumn: 56,
      maxColumn: 62
    },
    {
      minRow: 31,
      maxRow: 40,
      minColumn: 53,
      maxColumn: 63
    },
    {
      minRow: 34,
      maxRow: 40,
      minColumn: 54,
      maxColumn: 64
    },
    {
      minRow: 39,
      maxRow: 43,
      minColumn: 53,
      maxColumn: 65
    },
    {
      minRow: 43,
      maxRow: 48,
      minColumn: 52,
      maxColumn: 66
    },
    {
      minRow: 49,
      maxRow: 52,
      minColumn: 49,
      maxColumn: 69
    },
  ]

  return templeCoordinates.find((temple) => {
    return (rowIndex >= temple.minRow && rowIndex <= temple.maxRow) && (columnIndex >= temple.minColumn && columnIndex <= temple.maxColumn)
  })
}

const getLobbyDoor = (rowIndex: number, columnIndex: number) => {
  const templeDoorCoordinates =  [
    {
      minRow: 53,
      maxRow: 54,
      minColumn: 44,
      maxColumn: 74
    },
    {
      minRow: 49,
      maxRow: 53,
      minColumn: 57,
      maxColumn: 60
    }]

 return  templeDoorCoordinates.find((temple) => {
    return (rowIndex >= temple.minRow && rowIndex <= temple.maxRow) && (columnIndex >= temple.minColumn && columnIndex <= temple.maxColumn)
  })
}

const getLobbyArea = (rowIndex: number, columnIndex: number) => {
  const maxRow = 67;
  const minRow = 26;
  const minColumn = 5;
  const maxColumn = 129
  const difference = rowIndex >= minRow && rowIndex <= maxRow ? ((maxRow - 4) - rowIndex) : 0
  return (rowIndex >= minRow && rowIndex <= maxRow) && (columnIndex >= (minColumn + difference) && columnIndex <= (maxColumn - difference))
}

const getTemplateMap = (): Record<number, CellData[]> => {
  return template.reduce<Record<number, CellData[]>>((acc, line, rowIndex) => {
    const lines: CellData[] = line.split('').map((char, columnIndex) => {
      return {
        value: char,
        color: colorMap[char] || 'rgba(255,255,255,1)',
        transparentFillColor: colorMap[char],
        fillColor: fillColorMap[char] || colorByTile(rowIndex, columnIndex),
        block: shouldBlock(char),
        rowNumber: rowIndex,
        columnNumber: columnIndex,
        animation: shouldAnimate(char) ? {
          name: animationByChar(char),
          interval: intervalByChar(char),
          value: char,
          color: colorMap[char] || "white"
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
      return randomBase * 10
  }
}
const animationByChar = (char: string): string | null => {
  if ([''].includes(char)) return "move"
  if ([''].includes(char)) return "move_brightup"
  if ([''].includes(char)) return "brightup"
  return null
}

const shouldBlock = (char: string) => {
  return [''].includes(char)
}

const shouldAnimate = (char: string) => {
  return [''].includes(char)
}

const template = [
`                                         `,
`               OO                          `,
`              OOOO                           `,
`               ||                          `,
`               ||                          `,
`               ||                          `,
`               ||                          `,
`               ||                          `,
`          OO   ||                            `,
`         OOOO  ||                             `,
`          ||   ||                            `,
`          ||   ||                          `,
`          ||   ||                          `,
`          ||   ||                                   `,
`          ||   || |||||||||||||||||||||||||||||                     `,
`          ||   |||                             |||                             `,
`          |||||                                   |||                                   `,
`          ||         888       888       888         ||                                         `,
`        ||||        88888     88888     88888         ||                                             `,
`       || ||        |888|     |888|     |888|          ||                                               `,
`      ||  ||        |---|     |---|     |---|           ||                                                 `,
`     ||   ||        -----     -----     -----            ||                                                    `,
`    ||    ||          |         |         |               ||                                                   `,
`   ||     ||          |         |         |                ||                                                   `,
`    ||    ||          |_________|_________|               ||                                                 `,
`     ||   ||                    |                        ||                                                   `,
`      ||  ||                    |                       ||                                                `,
`       || ||                   888                     ||                                               `,
`        ||||                  88888                   ||                                             `,
`          ||                   888                  |||                                         `,
`            |||                                   |||                                      `,
`               |||                             |||                             `,
`     ||||||||||||||||||||               |||||||||||||||||||||                        `,
`                        /               \\                                              `,
`                       /                 \\         `,
`                      /                   \\          `,
`                     /                     \\         `,
`                    /                       \\        `,
`                   /                         \\       `,
`                  /                           \\                     `,
`                 /                             \\                    `,
`                /                               \\                   `,
`               /                                 \\                  `,
`              /                                   \\                 `,
`             /                                     \\                `,
`            /                                       \\               `,
`           /                                         \\              `,
`          /                                           \\             `,
`                                                             `,
]


const asset: GameAsset = {
  template,
  templateMap: getTemplateMap(),
  colorMap
}

export default asset