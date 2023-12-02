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
export enum NftItemClass {
  Container = 'nft__container',
  Image = 'nft__img',
  Title = 'nft__title',
  Description = 'nft__description',
  Price = 'nft__price',
  Status = 'nft__status',
  MetadataUri = 'nft__metadataUri',
  ButtonSell = 'nft__button-sell',
  UserName = 'nft__user-name',
  AddressNFT = 'nft__address',
  OrderNFT = 'nft__order',

  ButtonDelist = 'nft__button-delist',
  UserAvatar = 'nft-card__user-avatar',
}

export type NftItemElementObject = {
  eContainer: HTMLDivElement
  eImage: HTMLImageElement
  eTitle: HTMLDivElement
  eDescription: HTMLDivElement
  ePrice: HTMLDivElement
  eStatus: HTMLDivElement
  eMetadataUri: HTMLDivElement
  eButtonSell: HTMLButtonElement
  eUserName: HTMLDivElement
  eAddressNFT: HTMLAnchorElement
  eOrderNFT: HTMLDivElement
  eButtonDelist: HTMLButtonElement
  eUserAvatar: HTMLImageElement
}

export enum PageElementId {
  ContainerNoConnection = '#container-no-connection',
  ContainerConnected = '#container-connected',
  ButtonConnect = '#btn-connect',
  LabelWalletStatus = '#label-wallet-status',
  LabelWalletAddress = '#label-wallet-address',
  LabelWalletNativeBalance = '#label-wallet-native-balance',
  ListTokenContainer = '#list-token__container',
  ListNftContainer = '#list-nft__container',
  LabelWalletToken = '#wallet__token-value',

  AddressExploreLink = '#label-wallet-address-link',
  UserAvatar = '#user-avatar',
}
