import { CHAINS } from '../constants/chains'

export const getAddressExplorerHref = (address: string) => {
  const chain = localStorage.getItem('chainId')
  if (!chain) {
    return `${CHAINS[1].blockExplorerUrl}/address/${address}`
  }
  if (chain === CHAINS[0].chainId.toString()) {
    return `${CHAINS[0].blockExplorerUrl}/address/${address}`
  } else {
    return `${CHAINS[1].blockExplorerUrl}/address/${address}`
  }
}

export const getTransactionExplorerHref = (address: string) => {
  const chain = localStorage.getItem('chainId')
  if (!chain) {
    return `${CHAINS[1].blockExplorerUrl}/txs/${address}`
  }
  if (chain === CHAINS[0].chainId.toString()) {
    return `${CHAINS[0].blockExplorerUrl}/txs/${address}`
  } else {
    return `${CHAINS[1].blockExplorerUrl}/txs/${address}`
  }
}

export const getCollectionDetailHref = (address: string) => `/collection.html?cltAddress=${address}`
