import { ADDRESS_OF_CHAINS, AppError } from '../constants'
import { AccountPageControllerInstance } from '../page/account/controller'
import { connectAndSwitch, getChainCurrentChainId } from '../services'
import { deposit } from '../services/token-exchange'

export enum ModalDepositNFTId {
  Container = 'modal-depos',
  ButtonAccept = 'modal-depos-ok',
  ButtonClose = 'modal-depos-close',
  ButtonCancel = 'modal-depos-cancel',
  OverlayClose = 'modal-depos-overlay-close',
  Price = 'modal-depos-price',
}

class ModalDepositController {
  constructor() {
    this.listener()
  }

  set() {}

  get() {}

  updateDomContent() {}

  listener() {
    const modalButtonAccept = document.getElementById(
      ModalDepositNFTId.ButtonAccept,
    ) as HTMLButtonElement

    const ModalDepositCancel = document.getElementById(
      ModalDepositNFTId.ButtonCancel,
    ) as HTMLElement
    const ModalDepositClose = document.getElementById(ModalDepositNFTId.ButtonClose) as HTMLElement
    const modalOverlayClose = document.getElementById(ModalDepositNFTId.OverlayClose) as HTMLElement
    const modalOverlayAcccept = document.getElementById(
      ModalDepositNFTId.ButtonAccept,
    ) as HTMLElement

    ModalDepositClose.addEventListener('click', (e) => {
      e.preventDefault()
      this.close()
    })
    ModalDepositCancel.addEventListener('click', (e) => {
      e.preventDefault()
      this.close()
    })
    modalOverlayClose.addEventListener('click', (e) => {
      e.preventDefault()
      this.close()
    })
    modalOverlayAcccept.addEventListener('click', (e) => {
      this.deposit()
    })
  }

  close() {
    const modal = document.getElementById(ModalDepositNFTId.Container) as HTMLElement
    modal.style.display = 'none'
  }

  toggle(event: any) {
    event.preventDefault()
    let modal = document.getElementById(ModalDepositNFTId.Container) as HTMLElement
    if (modal.style.display === 'none') {
      modal.style.display = 'flex'
    } else {
      modal.style.display = 'none'
    }
  }

  open() {
    let modal = document.getElementById(ModalDepositNFTId.Container) as HTMLElement
    modal.style.display = 'flex'
  }

  async deposit() {
    const priceInput = document.getElementById(ModalDepositNFTId.Price) as HTMLInputElement

    if (!priceInput.value) {
      throw new Error(AppError.INPUT_INVALID)
    }

    try {
      connectAndSwitch()
    } catch (error: any) {
      if (error.message === AppError.NOT_INSTALLED_METAMASK) {
        window.open('https://metamask.io/download.html', '_blank')
      }
      throw new Error(AppError.NOT_INSTALLED_METAMASK)
    }

    const currentChainId = await getChainCurrentChainId()
    if (!currentChainId) {
      throw new Error(AppError.CHAIN_ID_INVALID)
    }
    try {
      const response = await deposit(
        ADDRESS_OF_CHAINS[currentChainId].WUIT,
        priceInput.value.toString(),
      )
      console.log(response)
      AccountPageControllerInstance.reloadBalance()
      this.close()
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

export const ModalDepositControllerInstance = new ModalDepositController()
