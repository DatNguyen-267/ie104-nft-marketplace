import { ethereumAddressRegex } from '../../utils/regex'

const search = window.location.search
console.log({ search })
const collectionAddress = search.replace('?cltAddress=', '')
console.log({ collectionAddress })

if (ethereumAddressRegex.test(collectionAddress)) {
  console.log('valid')
} else {
  console.log('invalid')
}
