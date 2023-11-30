import { HTMLElementLoadingList } from '../constants/elements'
import { ChainManagerInstance } from '../controller/chain'
import { LoadingControllerInstance } from '../controller/loading'
import { ModalBuyControllerInstance, ModalBuyNFTId } from '../controller/modal-buy'
import { WalletManagerInstance, showWalletInfo } from '../controller/wallet'
import { connectEarly } from '../services'
import './../components/NFTcard/styles.css'
import './../components/alert/styles.css'
import './../components/avatar/styles.css'
import './../components/button/styles.css'
import './../components/header/styles.css'
import './../components/loading/loading2/styles.css'
import './../components/modal/modalBuyNFT/styles.css'
import './../components/modal/modalSellNFT/styles.css'
import './../components/toast/styles.css'
import './../styles/base.css'
import './../styles/grid.css'
import './../components/page-loading/styles.css'

import { LandingPageControllerInstance } from './controller'
import './styles.css'
import { PageElementId } from './types'

connectEarly()
  .then(() => {
    WalletManagerInstance.listener()
    WalletManagerInstance.updateAccountAddress()
    ChainManagerInstance.initChainId()
    showWalletInfo(WalletManagerInstance.currentAddress)
  })
  .catch((err) => {
    console.log(err)
  })

const btnLogin = document.getElementById('btn-login') as HTMLButtonElement
const popUpUserClose = document.getElementById('close-pop-up-user') as HTMLElement
const headerAvatar = document.getElementById('header-avatar') as HTMLElement
const alertOverlay = document.getElementById('alert-overlay-close') as HTMLElement
const alertCancel = document.getElementById('alert-cancel') as HTMLElement
const alertClose = document.getElementById('alert-close') as HTMLElement
const signOut = document.getElementById('header-sign-out') as HTMLElement

let login: boolean = false
if (login === (true as boolean)) {
  headerAvatar.style.display = 'flex'
  btnLogin.style.display = 'none'
} else {
  headerAvatar.style.display = 'none'
  btnLogin.style.display = 'flex'
}

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

// hide pop up when resize
window.addEventListener('resize', () =>{
  var w = window.innerWidth;
  if(w <= 880){
    var x = document.getElementById('pop-up-user') as HTMLElement
    x.style.visibility = 'hidden'
    x.style.opacity = '0'
  }
})

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
        LoadingControllerInstance.close()
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {})
  })
  function animationText() {
    const sentences = ['SELL NFTs', 'CREATE YOUR NFTs']

    let currentIndex = 0
    let offset = 0
    const sentenceElement = document.querySelector('.sentence')
    if (!sentenceElement) return
    let forwards = true
    let skipCount = 0
    const skipDelay = 15
    const speed = 70

    const updateSentence = () => {
      sentenceElement.textContent = sentences[currentIndex].substring(0, offset)
    }

    const handleAnimation = () => {
      if (forwards) {
        if (offset >= sentences[currentIndex].length) {
          if (++skipCount === skipDelay) {
            forwards = false
            skipCount = 0
          }
        }
      } else if (offset === 0) {
        forwards = true
        currentIndex = (currentIndex + 1) % sentences.length
      }

      if (skipCount === 0) {
        forwards ? offset++ : offset--
      }

      updateSentence()
    }

    setInterval(handleAnimation, speed)
  }
  animationText()
  try {
    initPage()
    window.ethereum.on('chainChanged', (chainId: string) => {
      ChainManagerInstance.updateChainId(chainId)
      initPage()
      let listNftContainer = document.querySelector(
        PageElementId.ListNftContainer,
      ) as HTMLDivElement
      if (listNftContainer) {
        listNftContainer.innerHTML = HTMLElementLoadingList
      }
    })
  } catch (error) {
    console.log(error)
  }
})
