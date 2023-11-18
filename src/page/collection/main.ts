import { ethereumAddressRegex } from '../../utils/regex'

const search = window.location.search
const collectionAddress = search.replace('?cltAddress=', '')

if (ethereumAddressRegex.test(collectionAddress)) {
  console.log('valid')
} else {
  console.log('invalid')
}
