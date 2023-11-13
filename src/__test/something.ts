import { DEFAULT_NFT_ITEM } from '../constants/default-data'
import { ModalBuyControllerInstance } from '../controller/modal-buy'
import { UserPopoverControllerInstance } from '../controller/user'
import { connectAndSwitch, getMetadata, getTokenUri, getUrlImage } from '../services'
import { viewAsksByCollection, viewMarketCollections } from '../services/market'
import { NftItem } from '../types/nft'
import { shorterAddress } from '../utils'

async function handleBuyNft(nftItem: NftItem) {
  try {
    await connectAndSwitch()
    await UserPopoverControllerInstance.connect()

    try {
      ModalBuyControllerInstance.set(nftItem)
      ModalBuyControllerInstance.open()
    } catch (error) {}
  } catch (error) {}
}
