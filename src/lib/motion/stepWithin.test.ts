import { stepWithin } from './stepWithin'

describe('stepWithin', () => {
  it('keeps the step while every step fits the budget', () => {
    expect(stepWithin({ step: 1000, count: 3, fixed: 300, budget: 4000 })).toBe(1000)
    expect(stepWithin({ step: 700, count: 3, fixed: 1360, budget: 3460 })).toBe(700)
  })

  it('shrinks the step so the last one ends on the budget when the count is larger', () => {
    expect(stepWithin({ step: 1000, count: 6, fixed: 400, budget: 4000 })).toBe(600)
    expect(stepWithin({ step: 360, count: 10, fixed: 1300, budget: 3960 })).toBe(266)
  })

  it('keeps the step when there is nothing to step through', () => {
    expect(stepWithin({ step: 700, count: 0, fixed: 1360, budget: 3960 })).toBe(700)
  })

  it('gives no time to a step when the fixed part already spends the budget', () => {
    expect(stepWithin({ step: 700, count: 2, fixed: 5000, budget: 3960 })).toBe(0)
  })
})
