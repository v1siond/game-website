import { slashParts } from '@/components/cv/slashParts'

describe('slashParts', () => {
  it('cuts a slash joined name after its slash, the slash kept on the first name', () => {
    expect(slashParts('DailyDrip/SmoothTerminal')).toEqual(['DailyDrip/', 'SmoothTerminal'])
  })

  it('cuts after every slash of a longer chain', () => {
    expect(slashParts('Fintech/InsureTech/Audit')).toEqual(['Fintech/', 'InsureTech/', 'Audit'])
  })

  it('keeps a name with no slash whole, spaces included', () => {
    expect(slashParts('Daring Bit Assembly, Inc')).toEqual(['Daring Bit Assembly, Inc'])
  })

  it('keeps a trailing slash on the last part and gives nothing for an empty name', () => {
    expect(slashParts('PMX/')).toEqual(['PMX/'])
    expect(slashParts('')).toEqual([])
  })
})
