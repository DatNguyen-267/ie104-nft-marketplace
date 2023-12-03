import { getDisplayMaxDecimals } from '../utils'

describe('getDisplayMaxDecimals', () => {
  it('should return 0 if decimals is undefined', () => {
    const result = getDisplayMaxDecimals()
    expect(result).toBe(0)
  })

  it('should return 0 if decimals is less than 8', () => {
    const result = getDisplayMaxDecimals(5)
    expect(result).toBe(5)
  })

  it('should return 8 if decimals is equal to 8', () => {
    const result = getDisplayMaxDecimals(8)
    expect(result).toBe(8)
  })

  it('should return 8 if decimals is greater than 8', () => {
    const result = getDisplayMaxDecimals(10)
    expect(result).toBe(8)
  })
})
