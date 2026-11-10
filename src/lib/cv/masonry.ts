// The masonry layout every world gives its long lists (projects, jobs, bands, tech stack categories): CSS
// columns, so cards of different heights pack without gaps. Pass to a list's className and itemClassName;
// each world styles the cards inside it.
export const MASONRY_LIST = 'columns-1 gap-6 md:columns-2 xl:columns-3'
export const MASONRY_ITEM = 'mb-6 break-inside-avoid'

// The tool tiles inside one masonry card: two up while the card's column is wide enough for its longest
// name, one up when it is not. The count follows the card's width, not the viewport's, because a card
// in a three column row can be narrower than the same card alone on a phone.
export const MASONRY_TILES = 'grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]'
