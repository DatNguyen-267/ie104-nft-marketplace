export enum AppError {
  SOME_ERROR_HAS_OCCUR = 'Some error has occur',
  NOT_INSTALLED_METAMASK = 'Please install metamask',
  CONNECT_WALLET_PROCESSING_PLEASE_OPEN_WALLET = 'CONNECT WALLET PROCESSING PLEASE OPEN WALLET',
  API_KEY_INVALID = 'Api key invalid',
  NOT_SUPPORTED_CHAIN_ID = 'Not supported chain id',
  PROVIDER_IS_NOT_VALID = 'Provider is not valid',
  APPROVE_TOKEN_EXCHANGE_FAILED = 'Approve token exchange failed',
  APPROVE_SPENDER_TO_ACCESS_NFT_FAILED = 'Approve spender to access nft failed',
  OWNER_IS_NOT_VALID = 'Owner is not valid',
  CONNECT_WALLET_FAIL = 'Connect wallet fail',
  INPUT_INVALID = 'Input invalid',

  CHAIN_ID_INVALID = 'ChainID invalid',
}

export enum BuyNftErrorMessage {
  BUY_FAIL = 'Buy nft fail',
  SELLER_MUST_BE_NOT_OWNER = 'Seller must be not owner of the nft',
  NOT_APPROVED = 'Not approved',
}
