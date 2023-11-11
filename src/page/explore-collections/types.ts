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
}

export type CollectionItemElementObject = {
  eContainer: HTMLDivElement
  eImage: HTMLDivElement
  eTitle: HTMLDivElement
  eDescription: HTMLDivElement
  eCollectionAddress: HTMLDivElement
  eOwner: HTMLDivElement
}

export enum PageElementId {
  ListCollectionContainer = '#list-collection__container',
}
