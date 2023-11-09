import { AppError, BuyNftErrorMessage, MARKETPLACE_ADDRESS, WBNB_ADDRESS } from '../constants'
import { connectAndSwitch, getAccountAddress } from '../services'
import { buyTokenUsingWBNB } from '../services/market'
import { approveTokenExchange } from '../services/token-exchange'
import { NftItem } from '../types/nft'
import { shorterAddress } from '../utils'

export enum ModalDepositNFTId {
  Container = 'modal-depos',
  ButtonAccept = 'modal-depos-ok',
  ButtonClose = 'modal-depos-close',
  ButtonCancel = 'modal-depos-cancel',
  OverlayClose = 'modal-depos-overlay-close',
  ItemPrice = 'modal-depos-price',
}

class ModalDepositController {

  constructor() {
    this.listener()
  }

  set(){

  }

  get(){
    
  }

  updateDomContent() {
 
  }
  
  listener() {
    const modalButtonAccept = document.getElementById(
      ModalDepositNFTId.ButtonAccept,
    ) as HTMLButtonElement

    const ModalDepositCancel = document.getElementById(ModalDepositNFTId.ButtonCancel) as HTMLElement
    const ModalDepositClose = document.getElementById(ModalDepositNFTId.ButtonClose) as HTMLElement
    const modalOverlayClose = document.getElementById(ModalDepositNFTId.OverlayClose) as HTMLElement

    ModalDepositClose.addEventListener('click', (e) => {
      e.preventDefault()
      this.close()
    })
    ModalDepositCancel.addEventListener('click', (e) => {
      e.preventDefault();
      this.close()
    })
    modalOverlayClose.addEventListener('click', (e) => {
      e.preventDefault();
      this.close()
    })

  }

  close() {
    const modal = document.getElementById(ModalDepositNFTId.Container) as HTMLElement
    modal.style.display = 'none'
  }

  toggle(event: any) {
    event.preventDefault()
    let modal = document.getElementById(ModalDepositNFTId.Container) as HTMLElement
    console.log(modal)
    console.log(modal.style.display === 'none')
    if (modal.style.display === 'none') {
      modal.style.display = 'flex'
    } else {
      modal.style.display = 'none'
    }
  }

  open() {
    console.log('open desposit')
    let modal = document.getElementById(ModalDepositNFTId.Container) as HTMLElement
    modal.style.display = 'flex'
  }
}

export const ModalDepositControllerInstance = new ModalDepositController()
