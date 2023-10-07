export enum TokenStandard {
  WBNB = 'WBNB',
}
export type ERC20_TOKEN_SUPPORTED_TYPE = {
  [key: string]: {
    address: string
    symbol: string
    decimals: number
  }
}
export const ERC20_TOKEN_SUPPORTED: ERC20_TOKEN_SUPPORTED_TYPE = {
  [TokenStandard.WBNB]: {
    address: '0xcB96060104AA0529Be0B8B4c15703a962A20DF60',
    symbol: 'WBNB',
    decimals: 18,
  },
}
