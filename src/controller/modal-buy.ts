import { ADDRESS_OF_CHAINS, AppError, BuyNftErrorMessage, DEFAULT_ADDRESS } from '../constants'
import { connectAndSwitch, getAccountAddress, getChainCurrentChainId } from '../services'
import { buyTokenUsingWrapToken } from '../services/market'
import { NftItem } from '../types/nft'
import { shorterAddress } from '../utils'
import { getAvatarByAddress } from '../utils/avatar'
import { LoadingControllerInstance } from './loading'
import { WalletManagerInstance, showWalletInfo } from './wallet'

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

    modalItemName.innerHTML = this.nftItem?.title || ''
    modalItemPrice.innerHTML = this.nftItem?.price || ''
    modalItemAddress.innerHTML = shorterAddress(this.nftItem?.collectionAddress || '')
    modalItemImage.src =
      this.nftItem?.imageGatewayUrl ||
      getAvatarByAddress(this.nftItem?.collectionAddress || DEFAULT_ADDRESS)
  }
  async buy() {
    if (!this.nftItem) {
      throw new Error(AppError.INPUT_INVALID)
    }

    if (!this.nftItem?.price) {
      throw new Error(AppError.SOME_ERROR_HAS_OCCUR)
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
      throw new Error(AppError.OWNER_IS_NOT_VALID)
    }

    const currentChainId = await getChainCurrentChainId()
    if (!currentChainId) {
      throw new Error(AppError.CHAIN_ID_INVALID)
    }
    LoadingControllerInstance.open()

    try {
      const response = await buyTokenUsingWrapToken(
        this.nftItem.collectionAddress,
        this.nftItem.tokenId,
        this.nftItem.price,
        ADDRESS_OF_CHAINS[currentChainId].WUIT,
        ADDRESS_OF_CHAINS[currentChainId].MARKET,
      )
      console.log(response)
      this.close()
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  listener() {
    const modalFee = document.getElementById(ModalBuyNFTId.Fee) as HTMLElement
    modalFee.innerHTML = '0.1'

    const modalBuyCancel = document.getElementById(ModalBuyNFTId.ButtonCancel) as HTMLElement
    const modalBuyClose = document.getElementById(ModalBuyNFTId.ButtonClose) as HTMLElement
    const modalOverlayClose = document.getElementById(ModalBuyNFTId.OverlayClose) as HTMLElement

    modalBuyClose.addEventListener('click', (e) => {
      e.preventDefault()
      this.close()
    })
    modalBuyCancel.addEventListener('click', (e) => {
      e.preventDefault()
      this.close()
    })
    modalOverlayClose.addEventListener('click', (e) => {
      e.preventDefault()
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
