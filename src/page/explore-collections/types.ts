export enum AttributeName {
  CltAddress = 'data-clt-address',
}
export enum CollectionItemClass {
  Container = 'collection-item__container',
  Image = 'collection-item__image',
  Title = 'collection-item__title',

  Description = 'collection-item__description',
  CollectionAddress = 'collection__address',
  Owner = 'collection__owner',

  OwnerAvatar = 'collection-item__owner-avatar',
  OwnerAddress = 'collection-item__owner-address',

  TotalSupply = 'collection-item__amount-number',
}

export type CollectionItemElementObject = {
  eContainer: HTMLDivElement
  eImage: HTMLDivElement
  eTitle: HTMLDivElement
  eDescription: HTMLDivElement
  eCollectionAddress: HTMLAnchorElement
  eOwnerAvatar: HTMLDivElement
  eOwnerAddress: HTMLAnchorElement

  eTotalSupply: HTMLDivElement
}

export enum PageElementId {
  ListCollectionContainer = '#list-collection__container',
  CollectionItemTemplate = '#collection-template',
}
