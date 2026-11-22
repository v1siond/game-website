import { readStored, writeStored, type StorageArea } from '@/lib/storage'

// jest.setup.ts swaps localStorage for a mock object; jsdom's sessionStorage keeps its methods on Storage.prototype.
const TARGET: Record<StorageArea, () => Storage> = { local: () => window.localStorage, session: () => Storage.prototype }

const blocked = () => {
  throw new DOMException('blocked', 'SecurityError')
}

afterEach(() => jest.restoreAllMocks())

describe.each(['local', 'session'] as const)('%s storage', (area) => {
  it('reads the stored value', () => {
    jest.spyOn(TARGET[area](), 'getItem').mockReturnValueOnce('v')
    expect(readStored(area, 'k')).toBe('v')
  })

  it('writes the value under its key', () => {
    const setItem = jest.spyOn(TARGET[area](), 'setItem').mockImplementationOnce(() => undefined)
    writeStored(area, 'k', 'v')
    expect(setItem).toHaveBeenCalledWith('k', 'v')
  })

  it('reads null when the browser blocks site data', () => {
    jest.spyOn(TARGET[area](), 'getItem').mockImplementationOnce(blocked)
    expect(readStored(area, 'k')).toBeNull()
  })

  it('writes nothing and does not throw when the browser blocks site data', () => {
    jest.spyOn(TARGET[area](), 'setItem').mockImplementationOnce(blocked)
    expect(() => writeStored(area, 'k', 'v')).not.toThrow()
  })
})
