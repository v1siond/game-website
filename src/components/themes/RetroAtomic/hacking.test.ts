import { buildBoard, type HackBoard } from './hacking'

// His tools as the content gives them; four of them are five plain letters, enough for a board.
const TOOLS = ['React', 'Redis', 'MySQL', 'Nginx', 'Elixir', 'Helm', 'Phoenix']

const bracketsOf = (board: HackBoard): string[] =>
  board.rows.flatMap((row) => row.cells).flatMap((cell) => (cell.kind === 'bracket' ? [cell.text] : []))

describe('password terminal board', () => {
  it('draws the same board for the same seed as before the bracket clean up', () => {
    const boards = [1, 42, 2024].map((seed) => buildBoard(TOOLS, seed) as HackBoard)
    expect(boards.map((board) => [board.password, board.rows[0].address, bracketsOf(board)])).toEqual([
      ['NGINX', '0xF5F6', ['(!?&?)', '[@]', '{,}', '<=-:#>']],
      ['REDIS', '0xFC1D', ['(;&)', '[#:]', '{?*,}', '<.>']],
      ['MYSQL', '0xF671', ['(!*-=)', '[_:=]', '{;.}', '<"-?!>']],
    ])
  })

  it('fills every bracket pair with junk only, never a letter a guess could read as a word', () => {
    const board = buildBoard(TOOLS, 7) as HackBoard
    expect(bracketsOf(board).every((text) => /^.[^A-Za-z]+.$/.test(text))).toBe(true)
  })
})
