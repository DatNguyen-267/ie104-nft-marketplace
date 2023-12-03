import { shorterAddress } from '../utils'

describe('shorterAddress', () => {
  it('should return the original address if its length is less than or equal to maxLength', () => {
    const result = shorterAddress('123 Main St', 15)
    expect(result).toBe('123 Main St')
  })

  it('should shorten the address correctly if its length exceeds maxLength', () => {
    const result = shorterAddress('1234567890ABCDEF', 10)
    expect(result).toBe('12345...CDEF')
  })

  it('should handle empty input correctly', () => {
    const result = shorterAddress('', 5)
    expect(result).toBe('')
  })

  it('should handle zero maxLength correctly', () => {
    const result = shorterAddress('Lorem ipsum', 0)
    expect(result).toBe('')
  })
})
