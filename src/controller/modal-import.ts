import { AppError, BuyNftErrorMessage, MARKETPLACE_ADDRESS, WBNB_ADDRESS } from '../constants'
import { connectAndSwitch, getAccountAddress } from '../services'
import { buyTokenUsingWBNB, importCollection } from '../services/market'
import { approveTokenExchange } from '../services/token-exchange'
import { NftItem } from '../types/nft'
import { shorterAddress } from '../utils'

export enum ModalImportNFTId {
  Container = 'modal-import',
  ButtonAccept = 'modal-import-ok',
  ButtonClose = 'modal-import-close',
  ButtonCancel = 'modal-import-cancel',
  OverlayClose = 'modal-import-overlay-close',
  Address = 'modal-import-address',
}

class ModalImportController {
  constructor() {
    this.listener()
  }

  set() {}

  get() {}

  updateDomContent() {}

  listener() {
    const modalButtonAccept = document.getElementById(
      ModalImportNFTId.ButtonAccept,
    ) as HTMLButtonElement

    const ModalImportCancel = document.getElementById(ModalImportNFTId.ButtonCancel) as HTMLElement
    const ModalImportClose = document.getElementById(ModalImportNFTId.ButtonClose) as HTMLElement
    const modalOverlayClose = document.getElementById(ModalImportNFTId.OverlayClose) as HTMLElement
    const buttonAccept = document.getElementById(ModalImportNFTId.ButtonAccept) as HTMLElement

    ModalImportClose.addEventListener('click', (e) => {
      e.preventDefault()
      this.close()
    })
    ModalImportCancel.addEventListener('click', (e) => {
      e.preventDefault()
      this.close()
    })
    modalOverlayClose.addEventListener('click', (e) => {
      e.preventDefault()
      this.close()
    })
    buttonAccept.addEventListener('click', (e) => {
      this.importCollection()
    })
  }

  close() {
    const modal = document.getElementById(ModalImportNFTId.Container) as HTMLElement
    modal.style.display = 'none'
  }

  toggle(event: any) {
    event.preventDefault()
    let modal = document.getElementById(ModalImportNFTId.Container) as HTMLElement
    if (modal.style.display === 'none') {
      modal.style.display = 'flex'
    } else {
      modal.style.display = 'none'
    }
  }

  open() {
    let modal = document.getElementById(ModalImportNFTId.Container) as HTMLElement
    modal.style.display = 'flex'
  }

  async importCollection() {
    try {
      const cltAdressInput = document.getElementById(ModalImportNFTId.Address) as HTMLInputElement
      if (!cltAdressInput) {
        console.log('invalid input')
        return
      }
      const currentAddress = await getAccountAddress()
      if (!currentAddress) {
        console.log('invalid input')
        return
      }
      const response = await importCollection(cltAdressInput.value, currentAddress)
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }
}

export const ModalImportControllerInstance = new ModalImportController()
