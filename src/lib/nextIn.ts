// The next item of a cycle, the way a combo or a strike order runs round: the one after `last`, back to
// the first after the last item, and the first when nothing came before (null) or `last` is not in it.

/** The item after `last` in `list`, wrapping round; `list` must not be empty. */
export function nextIn<T>(list: readonly T[], last: T | null): T {
  if (last === null) return list[0]
  return list[(list.indexOf(last) + 1) % list.length]
}
