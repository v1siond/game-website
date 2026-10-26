import { postLinks, postPath } from '@/lib/blog/links'
import { shownDate } from '@/lib/blog/post'

const post = { slug: 'css-page-transition-portals', title: 'CSS page transition', date: '2026-10-26', description: 'Portals', draft: false }

describe('postLinks', () => {
  it('gives null with no posts, so the section is not shown', () => {
    expect(postLinks([])).toBeNull()
  })

  it('gives one link to the post with its title and date for one post', () => {
    expect(postLinks([post])).toEqual([
      { href: '/blog/css-page-transition-portals', title: 'CSS page transition', date: '2026-10-26', shownDate: 'Oct 26, 2026' },
    ])
  })

  it('keeps the order it is given', () => {
    const older = { ...post, slug: 'older', date: '2026-01-02' }
    expect(postLinks([post, older])?.map((link) => link.href)).toEqual([postPath(post.slug), '/blog/older'])
  })
})

describe('shownDate', () => {
  it('reads the date in UTC, so the first of the month never shows as the day before', () => {
    expect(shownDate('2026-03-01')).toBe('Mar 1, 2026')
  })
})
