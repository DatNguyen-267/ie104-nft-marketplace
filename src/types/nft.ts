export type NftItemStatus = 'Sale' | 'NotForSale'
export interface NftItem {
  tokenId: number
  collectionAddress: string
  title: string
  description: string
  tokenUri: string
  owner: string
  status: NftItemStatus
  imageUri: string
  imageGatewayUrl: string
  price: string
  seller?: string
}
