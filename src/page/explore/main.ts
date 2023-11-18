import { LoadingControllerInstance } from '../../controller/loading'
import { ModalBuyControllerInstance, ModalBuyNFTId } from '../../controller/modal-buy'
import { connectEarly } from '../../services'
import './../../components/NFTcard/styles.css'
import './../../components/alert/styles.css'
import './../../components/avatar/styles.css'
import './../../components/button/styles.css'
import './../../components/header/styles.css'
import './../../components/loading/loading2/styles.css'
import './../../components/modal/modalBuyNFT/styles.css'
import './../../components/modal/modalSellNFT/styles.css'
import './../../styles/base.css'
import './../../styles/grid.css'
import './styles.css'
import { ExplorePageControllerInstance } from './controller'
import { UserPopoverControllerInstance } from '../../controller/user'
import { WalletManagerInstance, showWalletInfo } from '../../controller/wallet'

// ========================== Header =======================================
const popUpUserClose = document.getElementById('close-pop-up-user') as HTMLElement
const headerAvatar = document.getElementById('header-avatar') as HTMLElement
const alertOverlay = document.getElementById('alert-overlay-close') as HTMLElement
const alertCancel = document.getElementById('alert-cancel') as HTMLElement
const alertClose = document.getElementById('alert-close') as HTMLElement
const signOut = document.getElementById('header-sign-out') as HTMLElement

connectEarly()
  .then(() => {
    WalletManagerInstance.listener()
    WalletManagerInstance.updateAccountAddress()
    showWalletInfo(WalletManagerInstance.currentAddress)
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

document.addEventListener('DOMContentLoaded', () => {
  async function initPage() {
    try {
      try {
      } catch (error) {}
      await ExplorePageControllerInstance.getAllNftOfMarket()
    } catch (error) {}
  }

  const modalButtonAccept = document.getElementById(ModalBuyNFTId.ButtonAccept) as HTMLButtonElement
  modalButtonAccept.addEventListener('click', (e) => {
    LoadingControllerInstance.open()
    ModalBuyControllerInstance.buy()
      .then((res) => {
        ExplorePageControllerInstance.getAllNftOfMarket()
      })
      .finally(() => {
        LoadingControllerInstance.close()
      })
  })

  initPage()
})

// ============================= Test Toast ====================================

// const btnLogout = document.getElementById('alert-ok') as HTMLButtonElement;
// var test = true;
// btnLogout.onclick = () =>{
//   if(test){
//     ToastControllerInstance.set('alert ok',ToastType.success)
//     ToastControllerInstance.open()
//     test = false;
//   }
//   else{
//     ToastControllerInstance.set('alert error',ToastType.error)
//     ToastControllerInstance.open()
//     test = true;
//   }
// }
