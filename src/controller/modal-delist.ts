import { AppError, DEFAULT_ADDRESS } from '../constants'
import { connectAndSwitch } from '../services'
import { cancelAskOrder } from '../services/market'
import { NftItem } from '../types/nft'
import { getAvatarByAddress } from '../utils/avatar'
import { shorterAddress } from '../utils/common'

export enum ModalDelistNFTId {
  Container = 'modal-delist',
  ButtonAccept = 'modal-delist-ok',
  ButtonClose = 'modal-delist-close',
  ButtonCancel = 'modal-delist-cancel',
  ItemName = 'modal-delist-nft-name',
  ItemPrice = 'modal-delist-price',
  ItemImage = 'modal-delist-nft-img',
  ItemAddress = 'modal-delist-nft-address',

  Fee = 'modal-delist-fee',
  Total = 'modal-delist-total',
  Overlay = 'modal-delist-overlay-close',
}

class ModalDelistController {
  nftItem: NftItem | null
  constructor(_nftItem?: NftItem) {
    this.nftItem = _nftItem || null
    this.listener()
  }

  set(_nftItem: NftItem) {
    this.nftItem = _nftItem
    this.updateDomContent()
  }

  get() {
    return this.nftItem
  }

  updateDomContent() {
    const modalItemName = document.getElementById(ModalDelistNFTId.ItemName) as HTMLElement
    const modalItemAddress = document.getElementById(ModalDelistNFTId.ItemAddress) as HTMLElement
    const modalItemImage = document.getElementById(ModalDelistNFTId.ItemImage) as HTMLImageElement

    modalItemName.innerHTML = this.nftItem?.title || ''
    modalItemAddress.innerHTML = shorterAddress(this.nftItem?.collectionAddress || '')
    modalItemImage.src =
      this.nftItem?.imageGatewayUrl ||
      getAvatarByAddress(this.nftItem?.collectionAddress || DEFAULT_ADDRESS)
  }

  async delist() {
    if (!this.nftItem) return
    try {
      connectAndSwitch()
    } catch (error) {
      throw new Error(AppError.CONNECT_WALLET_FAIL)
    }
    try {
      const response = await cancelAskOrder(
        this.nftItem.collectionAddress,
        this.nftItem.tokenId.toString(),
      )
      console.log(response)
      this.close()
    } catch (error) {
      console.log(error)
      return
    }
  }

  listener() {
    const ModalDelistCancel = document.getElementById(ModalDelistNFTId.ButtonCancel) as HTMLElement
    const ModalDelistClose = document.getElementById(ModalDelistNFTId.ButtonClose) as HTMLElement
    const ModalDelistOverlay = document.getElementById(ModalDelistNFTId.Overlay) as HTMLElement

    ModalDelistClose.addEventListener('click', (e) => {
      e.preventDefault()
      this.close()
    })
    ModalDelistCancel.addEventListener('click', (e) => {
      e.preventDefault()
      this.close()
    })
    ModalDelistOverlay.addEventListener('click', (e) => {
      e.preventDefault()
      this.close()
    })
  }

  close() {
    const modal = document.getElementById(ModalDelistNFTId.Container) as HTMLElement
    modal.style.display = 'none'
  }

  open() {
    let modal = document.getElementById(ModalDelistNFTId.Container) as HTMLElement
    modal.style.display = 'flex'
  }

  toggle(event: any) {
    event.preventDefault()
    let modal = document.getElementById(ModalDelistNFTId.Container) as HTMLElement
    if (modal.style.display === 'none') {
      modal.style.display = 'flex'
    } else {
      modal.style.display = 'none'
    }
  }
}

export const ModalDelistControllerInstance = new ModalDelistController()
