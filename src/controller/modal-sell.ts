import { ADDRESS_OF_CHAINS, AppError, BuyNftErrorMessage, DEFAULT_ADDRESS } from '../constants'
import { connectAndSwitch, getAccountAddress, getChainCurrentChainId } from '../services'
import { createAskOrder } from '../services/market'
import { NftItem } from '../types/nft'
import { getAvatarByAddress } from '../utils/avatar'
import { shorterAddress } from '../utils/common'
import { LoadingControllerInstance } from './loading'
import { WalletManagerInstance, showWalletInfo } from './wallet'

export enum ModalSellNFTId {
  Container = 'modal-sell',
  ButtonAccept = 'modal-sell-ok',
  ButtonClose = 'modal-sell-close',
  ButtonCancel = 'modal-sell-cancel',
  ItemName = 'modal-sell-nft-name',
  ItemPrice = 'modal-sell-price',
  ItemImage = 'modal-sell-nft-img',
  ItemAddress = 'modal-sell-nft-address',
  // NetWorkName = 'modal-sell__network-id',
  Fee = 'modal-sell-fee',
  Total = 'modal-sell-total',
  Overlay = 'modal-sell-overlay-close',
}

class ModalSellController {
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
    const modalItemName = document.getElementById(ModalSellNFTId.ItemName) as HTMLElement
    const modalItemPrice = document.getElementById(ModalSellNFTId.ItemPrice) as HTMLElement
    // const modalNetWorkName = document.getElementById(ModalSellNFTId.NetWorkName) as HTMLElement
    const modalTotal = document.getElementById(ModalSellNFTId.Total) as HTMLElement
    const modalItemAddress = document.getElementById(ModalSellNFTId.ItemAddress) as HTMLElement
    const modalItemImage = document.getElementById(ModalSellNFTId.ItemImage) as HTMLImageElement

    modalTotal.innerHTML = (
      -(Number(this.nftItem?.price) * 0.1) / 100 +
      Number(this.nftItem?.price)
    ).toFixed(8)

    modalItemName.innerHTML = this.nftItem?.title || ''
    modalItemPrice.innerHTML = this.nftItem?.price || ''
    modalItemAddress.innerHTML = shorterAddress(this.nftItem?.collectionAddress || '')
    modalItemImage.src =
      this.nftItem?.imageGatewayUrl ||
      getAvatarByAddress(this.nftItem?.collectionAddress || DEFAULT_ADDRESS)
  }
  async sell() {
    if (!this.nftItem) {
      throw new Error(AppError.INPUT_INVALID)
    }

    try {
      await connectAndSwitch()
      WalletManagerInstance.listener()
      WalletManagerInstance.updateAccountAddress()
      showWalletInfo(WalletManagerInstance.currentAddress)
    } catch (error: any) {
      if (error.message === AppError.NOT_INSTALLED_METAMASK) {
        window.open('https://metamask.io/download.html', '_blank')
      }
      throw new Error(AppError.NOT_INSTALLED_METAMASK)
    }

    const currentAddress = await getAccountAddress()
    if (this.nftItem?.seller?.toLowerCase() === currentAddress?.toLowerCase()) {
      throw new Error(BuyNftErrorMessage.SELLER_MUST_BE_NOT_OWNER)
    }

    const modalItemPrice = document.getElementById(ModalSellNFTId.ItemPrice) as HTMLInputElement
    const price = modalItemPrice.value
    if (!price) {
      console.log(AppError.SOME_ERROR_HAS_OCCUR)
      throw new Error(AppError.SOME_ERROR_HAS_OCCUR)
    }
    if (Number(price) <= 0) {
      console.log(AppError.PRICE_INVALID)
      throw new Error(AppError.PRICE_INVALID)
    }

    const currentChainId = await getChainCurrentChainId()
    if (!currentChainId) {
      throw new Error(AppError.CHAIN_ID_INVALID)
    }
    const currentMarketAddress = ADDRESS_OF_CHAINS[currentChainId].MARKET
    LoadingControllerInstance.open()

    try {
      const response = await createAskOrder(
        currentMarketAddress,
        this.nftItem.collectionAddress,
        this.nftItem.tokenId,
        price,
      )
      console.log(response)
      this.close()
    } catch (error) {
      throw error
    }
  }
  updateTotal() {
    const modalItemPrice = document.getElementById(ModalSellNFTId.ItemPrice) as HTMLInputElement
    const modalSellFee = document.getElementById(ModalSellNFTId.Fee) as HTMLInputElement
    const modalSellTotal = document.getElementById(ModalSellNFTId.Total) as HTMLInputElement

    var price = Number(modalItemPrice.value)

    var fee = Number(modalSellFee.innerHTML)
    modalSellTotal.innerHTML = (price - (price * fee) / 100).toString()
    modalSellTotal.title = modalSellTotal.innerHTML
  }
  listener() {
    const modalFee = document.getElementById(ModalSellNFTId.Fee) as HTMLElement
    modalFee.innerHTML = '0.1'

    const modalSellCancel = document.getElementById(ModalSellNFTId.ButtonCancel) as HTMLElement
    const modalSellClose = document.getElementById(ModalSellNFTId.ButtonClose) as HTMLElement
    const modalItemPrice = document.getElementById(ModalSellNFTId.ItemPrice) as HTMLInputElement
    const modalSellOverlay = document.getElementById(ModalSellNFTId.Overlay) as HTMLElement

    modalSellClose.addEventListener('click', (e) => {
      e.preventDefault()
      this.close()
    })
    modalSellCancel.addEventListener('click', (e) => {
      e.preventDefault()
      this.close()
    })
    modalSellOverlay.addEventListener('click', (e) => {
      e.preventDefault()
      this.close()
    })
    modalItemPrice.addEventListener('keyup', (e) => {
      this.updateTotal()
    })
  }
  close() {
    const modal = document.getElementById(ModalSellNFTId.Container) as HTMLElement
    modal.style.display = 'none'
  }

  toggle(event: any) {
    event.preventDefault()
    let modal = document.getElementById(ModalSellNFTId.Container) as HTMLElement
    if (modal.style.display === 'none') {
      modal.style.display = 'flex'
    } else {
      modal.style.display = 'none'
    }
  }

  open() {
    let modal = document.getElementById(ModalSellNFTId.Container) as HTMLElement
    modal.style.display = 'flex'
  }
}

export const ModalSellControllerInstance = new ModalSellController()
