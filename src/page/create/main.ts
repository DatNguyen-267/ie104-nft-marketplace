import { NFT_ADDRESS } from '../../constants'
import './styles.css'
import {
  connect,
  connectAndSwitch,
  connectEarly,
  createMetadata,
  getAccountAddress,
  getDefaultProvider,
  mintNFT,
  switchToNetwork,
} from '../../services'
import { UserPopoverControllerInstance } from '../../controller/user'

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

// ========================== Header =======================================
const popUpUserClose = document.getElementById('close-pop-up-user') as HTMLElement
const headerAvatar = document.getElementById('header-avatar') as HTMLElement
const alertOverlay = document.getElementById('alert-overlay-close') as HTMLElement
const alertCancel = document.getElementById('alert-cancel') as HTMLElement
const alertClose = document.getElementById('alert-close') as HTMLElement
const signOut = document.getElementById('header-sign-out') as HTMLElement

connectEarly().then(() => {
  UserPopoverControllerInstance.isConnected.set(true)
  UserPopoverControllerInstance.isConnected.loadAvatar()
})

// Toggle PopUP
function togglePopUpUser(event: Event): void {
  event.preventDefault()
  var x = document.getElementById('pop-up-user') as HTMLElement
  if (x.style.visibility === 'hidden') {
    x.style.visibility = 'visible'
    x.style.opacity = '1'
  } else {
    x.style.visibility = 'hidden'
    x.style.opacity = '0'
  }
}
popUpUserClose.onclick = togglePopUpUser
headerAvatar.onclick = togglePopUpUser

// Toggle Alert
const toggleAlertSigout = (event: any) => {
  event.preventDefault()
  var x = document.getElementById('alert-sigout') as HTMLElement
  if (x.style.visibility === 'hidden') {
    x.style.visibility = 'visible'
  } else {
    x.style.visibility = 'hidden'
  }
}
alertOverlay.onclick = toggleAlertSigout
alertCancel.onclick = toggleAlertSigout
alertClose.onclick = toggleAlertSigout
signOut.onclick = toggleAlertSigout

// ============================== UPLOAD IMAGE ===================================
const drogArea = document.getElementById('drop-area') as HTMLElement;
const inputFile = document.getElementById('input-file') as HTMLInputElement;
const imgView = document.getElementById('img-view') as HTMLElement;


inputFile.addEventListener('change', uploadImage)

function uploadImage() {
  var item = inputFile.files ? inputFile.files[0] : null
  if (item) {
    var mimeType = item['type'] ? item['type'] : ''
    if (mimeType.split('/')[0] === 'image' && inputFile.files) {
      let url = URL.createObjectURL(inputFile.files[0]).toString();
      imgView.style.backgroundImage = `url(${url})`
      imgView.textContent = ''
    }

  }
  // var mimeType=inputFile.files? inputFile.files[0]["type"]: ''
 
 
  //   if (mimeType.split('/')[0] === 'image' && inputFile.files) {
  //       let url = URL.createObjectURL(inputFile.files[0]).toString();
  //       imgView.style.backgroundImage = `url(${url})`
  //       imgView.textContent = ''
    
  //   }
  
}

drogArea.addEventListener('dragover', (e) => {
  e.preventDefault();
})
drogArea.addEventListener('drop', (e) => {
  e.preventDefault();
  if (e.dataTransfer) {
    inputFile.files = e.dataTransfer.files;
  }
  uploadImage();
})

// btn.addEventListener('click', ()=>{
//     console.log(file.files)
// })