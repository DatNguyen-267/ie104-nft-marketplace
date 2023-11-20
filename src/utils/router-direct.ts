export const getAddressExplorerHref = (address: string) =>
  `https://testnet.explorer.aioz.network/address/${address}`

export const getTransactionExplorerHref = (address: string) =>
  `https://testnet.explorer.aioz.network/txs/${address}`

export const getCollectionDetailHref = (address: string) => `/collection.html?cltAddress=${address}`
