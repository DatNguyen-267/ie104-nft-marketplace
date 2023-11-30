import { UserPopoverControllerInstance } from '../../controller/user'
import { WalletManagerInstance, showWalletInfo } from '../../controller/wallet'
import { connectEarly } from '../../services'
import { ethereumAddressRegex } from '../../utils/regex'
import { CollectionPageControllerInstance } from './controller'
import './styles.css'
import './../../components/page-loading/styles.css'

const search = window.location.search
const collectionAddress = search.replace('?cltAddress=', '')

if (ethereumAddressRegex.test(collectionAddress)) {
  console.log('valid')
} else {
  console.log('invalid')
}

// ========================== Header =======================================
const popUpUserClose = document.getElementById('close-pop-up-user') as HTMLElement
const headerAvatar = document.getElementById('header-avatar') as HTMLElement
const alertOverlay = document.getElementById('alert-overlay-close') as HTMLElement
const alertCancel = document.getElementById('alert-cancel') as HTMLElement
const alertClose = document.getElementById('alert-close') as HTMLElement
const signOut = document.getElementById('header-sign-out') as HTMLElement

connectEarly()
  .then(() => {
    UserPopoverControllerInstance.isConnected.set(true)
    UserPopoverControllerInstance.isConnected.loadAvatar()
  })
  .catch((err) => {
    console.log(err)
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

connectEarly()
  .then(() => {
    WalletManagerInstance.listener()
    WalletManagerInstance.updateAccountAddress()
    showWalletInfo(WalletManagerInstance.currentAddress)
  })
  .catch((err) => {
    console.log(err)
  })

document.addEventListener('DOMContentLoaded', () => {
  async function initPage() {
    try {
      try {
      } catch (error) {}
      await CollectionPageControllerInstance.getAllNftOfCollection()
    } catch (error) {}
  }

  initPage()
})

// hide pop up when resize
window.addEventListener('resize', () =>{
  var w = window.innerWidth;
  if(w <= 880){
    var x = document.getElementById('pop-up-user') as HTMLElement
    if(x){
      x.style.visibility = 'hidden'
      x.style.opacity = '0'
    }
  }
})