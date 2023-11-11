import { NFT_ADDRESS } from '../../constants'
import './styles.css'
import {
  connect,
  connectAndSwitch,
  createMetadata,
  getAccountAddress,
  getDefaultProvider,
  mintNFT,
  switchToNetwork,
} from '../../services'

console.log('create page script')

export enum PageElementId {
  ImageInput = '#input-file',
  NameInput = '#input-name',
  CollectionAddressInput = '#input-collection-address',
  DescriptionInput = '#input-description',
  ButtonCreate = '#btn-create-nft',
}
const imageInput = document.querySelector(PageElementId.ImageInput) as HTMLInputElement
const inputCollectionAddress = document.querySelector(
  PageElementId.CollectionAddressInput,
) as HTMLInputElement
const nameInput = document.querySelector(PageElementId.NameInput) as HTMLInputElement
const descriptionInput = document.querySelector(PageElementId.DescriptionInput) as HTMLInputElement
const btnCreate = document.querySelector(PageElementId.ButtonCreate) as HTMLButtonElement

function getFormValue() {
  const imageValue = imageInput.files && imageInput.files.length > 0 && imageInput.files[0]
  const nameValue = nameInput.value
  const descriptionValue = descriptionInput.value
  return { imageValue, nameValue, descriptionValue }
}
imageInput.addEventListener('input', () => {
  handleValidateForm()
})

nameInput.addEventListener('input', () => {
  handleValidateForm()
})

descriptionInput.addEventListener('input', () => {
  handleValidateForm()
})

const handleValidateForm = () => {
  const { imageValue, nameValue, descriptionValue } = getFormValue()
  if (imageValue && nameValue && descriptionValue) {
    btnCreate.disabled = false
  } else {
    btnCreate.disabled = true
  }
}
btnCreate.addEventListener('click', async () => {
  try {
    await connectAndSwitch()
    const address = await getAccountAddress()
    const { imageValue, nameValue, descriptionValue } = getFormValue()
    if (!imageValue) return
    const tokenUri = await createMetadata(imageValue, nameValue, descriptionValue)
      .then((res) => res)
      .catch((err) => {
        console.log(err)
      })
    console.log({ tokenUri })
    if (!address || !tokenUri || !inputCollectionAddress.value) {
      console.log('Invalid input')
      return
    }
    const mintNftTx = await mintNFT(inputCollectionAddress.value, address, tokenUri.url)
    console.log(mintNftTx)
  } catch (error) {
    console.log(error)
  }
})
