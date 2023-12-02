export enum PageElementId {
  ContainerNoConnection = '#container-no-connection',
  ContainerConnected = '#container-connected',
  ButtonConnect = '#btn-connect',
  ListNftContainer = '#list-nft__container',
  ContainerHeroCard = '#container-card',
}

export type NftItemElementObject = {
  eContainer: HTMLDivElement
  eImage: HTMLImageElement
  eTitle: HTMLDivElement
  eDescription: HTMLDivElement
  ePrice: HTMLDivElement
  eStatus: HTMLDivElement
  eMetadataUri: HTMLDivElement
  eButtonBuy: HTMLButtonElement
  eUserName: HTMLDivElement
  eAddressNFT: HTMLAnchorElement
  eOrderNFT: HTMLDivElement
  eUserAvatar: HTMLImageElement
}

export enum NftItemClass {
  Container = 'nft__container',
  Image = 'nft__img',
  Title = 'nft__title',
  Description = 'nft__description',
  Price = 'nft__price',
  Status = 'nft__status',
  MetadataUri = 'nft__metadataUri',
  ButtonBuy = 'nft__button-buy',
  UserName = 'nft__user-name',
  AddressNFT = 'nft__address',
  OrderNFT = 'nft__order',
  UserAvatar = 'nft-card__user-avatar',
}

export enum LoadingStatus {
  Pending = 'pending',
  Success = 'success',
  Fail = 'fail',
}
export enum AttributeName {
  Loading = 'data-loading',
  TokenId = 'data-token-id',
  CltAddress = 'data-clt-address',
}

export enum CardItemClass {
  Container = 'nft-eg__content',
  Image = 'nft__img',
  Title = 'nft-eg__name',
  UserName = 'nft-eg__user .user-name',
}
