import { LoadingControllerInstance } from '../controller/loading'
import { ModalBuyControllerInstance, ModalBuyNFTId } from '../controller/modal-buy'
import { UserPopoverControllerInstance } from '../controller/user'
import { connectEarly } from '../services'
import './../components/NFTcard/styles.css'
import './../components/alert/styles.css'
import './../components/avatar/styles.css'
import './../components/button/styles.css'
import './../components/header/styles.css'
import './../components/loading/loading2/styles.css'
import './../components/modal/modalBuyNFT/styles.css'
import './../components/modal/modalSellNFT/styles.css'
import './../components/loading/loading2/styles.css'
import './../components/toast/styles.css'
import './../styles/base.css'
import './../styles/grid.css'
import { LandingPageControllerInstance } from './controller'
import './styles.css'

connectEarly().then(() => {
  UserPopoverControllerInstance.isConnected.set(true)
  UserPopoverControllerInstance.isConnected.loadAvatar()
})

// ========================== Header =======================================
const btnLogin = document.getElementById('btn-login') as HTMLButtonElement
const popUpUserClose = document.getElementById('close-pop-up-user') as HTMLElement
const headerAvatar = document.getElementById('header-avatar') as HTMLElement
const alertOverlay = document.getElementById('alert-overlay-close') as HTMLElement
const alertCancel = document.getElementById('alert-cancel') as HTMLElement
const alertClose = document.getElementById('alert-close') as HTMLElement
const signOut = document.getElementById('header-sign-out') as HTMLElement

// Check Login
let login: boolean = false
if (login === (true as boolean)) {
  headerAvatar.style.display = 'flex'
  btnLogin.style.display = 'none'
} else {
  headerAvatar.style.display = 'none'
  btnLogin.style.display = 'flex'
}

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

// ============================= INFORMATION ====================================

// Active sroll card
const cards = document.querySelectorAll('.cards')

// const setClasses = () => {
//   const classes = ['left', 'active', 'right']
//   cards.forEach((card, index) => card.classList.add(classes[index]))
// }

const changePositions = (e: any) => {
  const clickedCard = e.currentTarget
  const activeCard = document.querySelector('.cards.active') as HTMLElement
  if (clickedCard.classList.contains('active')) return
  const classesFrom = e.currentTarget.className
  const classesTo = activeCard.className
  clickedCard.className = classesTo
  activeCard.className = classesFrom
}
cards.forEach((card) => {
  card.addEventListener('click', changePositions)
})
// setClasses()

// Set image for card

// ******************* DOM LOADED ***********************
document.addEventListener('DOMContentLoaded', () => {
  async function initPage() {
    try {
      try {
      } catch (error) {}
      await LandingPageControllerInstance.getAllNftOfMarket()
    } catch (error) {}
  }
  const modalButtonAccept = document.getElementById(ModalBuyNFTId.ButtonAccept) as HTMLButtonElement
  modalButtonAccept.addEventListener('click', (e) => {
    LoadingControllerInstance.open()
    ModalBuyControllerInstance.buy()
      .then((res) => {
        LandingPageControllerInstance.getAllNftOfMarket()
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        LoadingControllerInstance.close()
      })
  })
  initPage()
})
