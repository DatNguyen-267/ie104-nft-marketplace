import { DEFAULT_ADDRESS } from '../constants'
import { ethereumAddressRegex } from './regex'

export const getAvatarByAddress = (address: string) => {
  if (ethereumAddressRegex.test(address)) {
    return `https://effigy.im/a/${address}.svg`
  } else {
    return `https://effigy.im/a/${DEFAULT_ADDRESS}.svg`
  }
}
