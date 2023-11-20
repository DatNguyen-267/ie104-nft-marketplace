import { AppError, WBNB_ADDRESS } from '../constants'
import { AccountPageControllerInstance } from '../page/account/controller'
import { connectAndSwitch, getAccountAddress } from '../services'
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
    } catch (error) {
      throw new Error(AppError.CONNECT_WALLET_FAIL)
    }

    const currentAddress = await getAccountAddress()

    try {
      const response = await deposit(WBNB_ADDRESS, priceInput.value.toString())
      AccountPageControllerInstance.reloadBalance()
      this.close()
    } catch (error) {
      console.log(error)
      return
    }
  }
}

export const ModalDepositControllerInstance = new ModalDepositController()
