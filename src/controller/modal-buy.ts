import { AppError, BuyNftErrorMessage, MARKETPLACE_ADDRESS, WBNB_ADDRESS } from '../constants'
import { connectAndSwitch, getAccountAddress } from '../services'
import { buyTokenUsingWBNB } from '../services/market'
import { approveTokenExchange } from '../services/token-exchange'
import { NftItem } from '../types/nft'
import { shorterAddress } from '../utils'

export enum ModalBuyNFTId {
  Container = 'modal-buy',
  ButtonAccept = 'modal-buy-ok',
  ButtonClose = 'modal-buy-close',
  ButtonCancel = 'modal-buy-cancel',
  OverlayClose = 'modal-buy-overlay-close',
  ItemName = 'modal-buy-nft-name',
  ItemPrice = 'modal-buy-price',
  ItemImage = 'modal-buy-nft-img',
  ItemAddress = 'modal-buy-nft-address',
  // NetWorkName = 'modal-buy__network-id',
  Fee = 'modal-buy-fee',
  Total = 'modal-buy-total',
}

class ModalBuyController {
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
    const modalItemName = document.getElementById(ModalBuyNFTId.ItemName) as HTMLElement
    const modalItemPrice = document.getElementById(ModalBuyNFTId.ItemPrice) as HTMLElement
    // const modalNetWorkName = document.getElementById(ModalBuyNFTId.NetWorkName) as HTMLElement
    const modalTotal = document.getElementById(ModalBuyNFTId.Total) as HTMLElement
    const modalItemAddress = document.getElementById(ModalBuyNFTId.ItemAddress) as HTMLElement
    const modalItemImage = document.getElementById(ModalBuyNFTId.ItemImage) as HTMLImageElement

    modalTotal.innerHTML = (
      (Number(this.nftItem?.price) * 0.1) / 100 +
      Number(this.nftItem?.price)
    ).toFixed(8)

    console.log((Number(this.nftItem?.price) * 0.1) / 100)
    modalItemName.innerHTML = this.nftItem?.title || ''
    modalItemPrice.innerHTML = this.nftItem?.price || ''
    modalItemAddress.innerHTML = shorterAddress(this.nftItem?.collectionAddress) || ''
    modalItemImage.src = this.nftItem?.imageGatewayUrl || '#'
  }
  async buy() {
    console.log(this)

    try {
      connectAndSwitch()
    } catch (error) {
      throw new Error(AppError.CONNECT_WALLET_FAIL)
    }

    const currentAddress = await getAccountAddress()
    if (this.nftItem?.seller?.toLowerCase() === currentAddress?.toLowerCase()) {
      console.log(BuyNftErrorMessage.SELLER_MUST_BE_NOT_OWNER)
      return
    }
    if (!this.nftItem?.price) {
      console.log(AppError.SOME_ERROR_HAS_OCCUR)
      return
    }
    if (!this.nftItem) return
    try {
      const response = await buyTokenUsingWBNB(
        this.nftItem.collectionAddress,
        this.nftItem.tokenId,
        this.nftItem.price,
      )
      console.log(response)
      this.close()
    } catch (error) {
      console.log(error)
      return
    }
  }

  listener() {
    const modalButtonAccept = document.getElementById(
      ModalBuyNFTId.ButtonAccept,
    ) as HTMLButtonElement

    const modalFee = document.getElementById(ModalBuyNFTId.Fee) as HTMLElement
    modalFee.innerHTML = '0.1'
    modalButtonAccept.addEventListener('click', (e) => {
      this.buy()
    })

    const modalBuyCancel = document.getElementById(ModalBuyNFTId.ButtonCancel) as HTMLElement
    const modalBuyClose = document.getElementById(ModalBuyNFTId.ButtonClose) as HTMLElement
    const modalOverlayClose = document.getElementById(ModalBuyNFTId.OverlayClose) as HTMLElement

    modalBuyClose.addEventListener('click', (e) => {
      e.preventDefault()
      this.close()
    })
    modalBuyCancel.addEventListener('click', (e) => {
      e.preventDefault();
      this.close()
    })
    modalOverlayClose.addEventListener('click', (e) => {
      e.preventDefault();
      this.close()
    })

  }

  close() {
    const modal = document.getElementById(ModalBuyNFTId.Container) as HTMLElement
    modal.style.display = 'none'
  }

  toggle(event: any) {
    event.preventDefault()
    let modal = document.getElementById(ModalBuyNFTId.Container) as HTMLElement
    console.log(modal)
    console.log(modal.style.display === 'none')
    if (modal.style.display === 'none') {
      modal.style.display = 'flex'
    } else {
      modal.style.display = 'none'
    }
  }

  open() {
    let modal = document.getElementById(ModalBuyNFTId.Container) as HTMLElement
    modal.style.display = 'flex'
  }
}

export const ModalBuyControllerInstance = new ModalBuyController()
