import { CHAIN_IDS } from './chains'
export const ADDRESS_OF_CHAINS = {
  [CHAIN_IDS.AIOZ]: {
    DEPOSIT_RATE: 100000,
    // WUIT: '0xcB96060104AA0529Be0B8B4c15703a962A20DF60',
    WUIT: '0x21BBB423E8B386A3Ed9Ed253296ef79898Cbbd13',
    // MARKET: '0x634345357C9eA4B6e52765804d647048bd15e468',
    MARKET: '0x3bEd7F27D15b08C469485eE7f9A2BE69b06072b0',
    PUBLIC_ERC721_TOKEN: '0x7c81D92A6958670569A1586D471757bcD12b689c',
    COLLECTIONS: {
      DyanCat: {
        owner: '0x454574C8AD9706a8fC22dDA71Ce77Cb1CDd5fEB1',
        address: '0x772b21c128f759F75A352568B1F7b4fF331d1162',
      },
      OutOfMyStory: {
        owner: '0x454574C8AD9706a8fC22dDA71Ce77Cb1CDd5fEB1',
        address: '0x57B815813d053f276A45A5eddFB08D980F79e447',
      },
      AXO: {
        owner: '0xf9f0036e2AFAf6EEEa77E08D1BFA012e1442dA3F',
        address: '0xb4395776B71ad557C0E92ad3157B206271eB3f04',
      },
      OpepenEdition: {
        address: '0x9B5C1a360F8Be26bcaF90057943e74F33188dE8a',
        owner: '0x454574C8AD9706a8fC22dDA71Ce77Cb1CDd5fEB1',
      },
      NeoTokyoOuterCitizenV2: {
        address: '0x7dEAe85e7C0576cE58AEE1454DdDff635019abF2',
        owner: '0x454574C8AD9706a8fC22dDA71Ce77Cb1CDd5fEB1',
      },
      BlockGame: {
        address: '0x5aF1e8478eE83Ea428e41BE206bACf03c775523c',
        owner: '0x454574C8AD9706a8fC22dDA71Ce77Cb1CDd5fEB1',
      },
    },
  },

  [CHAIN_IDS.GOERLI]: {
    DEPOSIT_RATE: 100000,
    WUIT: '0x13724882900FaaC30151419E6D8Cd6a96069Aec4',
    MARKET: '0x946324A2F239C5ff6393B446EF698e816Aa82898',
    PUBLIC_ERC721_TOKEN: '0x993Ee67F5262c1B4c775d21EbD5bb85733AB3eFE',
    // PUBLIC_ERC721_TOKEN: '0xE51c681779EB648FB939331DCb6115E49f27A6Fb',
    COLLECTIONS: {
      DyanCat: {
        owner: '0x454574C8AD9706a8fC22dDA71Ce77Cb1CDd5fEB1',
        address: '0x5F3F8ef7630a4FC0DAd482D33178BF5A190a925e',
      },
      SanFranTokyo: {
        owner: '0x454574C8AD9706a8fC22dDA71Ce77Cb1CDd5fEB1',
        address: '0x947976e72e45d6741933bd28CD80e3D28A71619c',
      },
      TheGraps: {
        owner: '0x454574C8AD9706a8fC22dDA71Ce77Cb1CDd5fEB1',
        address: '0x55327442555db09955110428F46B66b902Dee1a4',
      },
      ElementalBean: {
        owner: '0xCd49a6c167016fEf9E9d68b8dBC2F4425E9AA7b8',
        address: '0x691a745C68410be4d96A02d96Bdbed68c7941e67',
      },
      MVP: {
        owner: '0xf9f0036e2AFAf6EEEa77E08D1BFA012e1442dA3F',
        address: '0xd908C6eD97C677d6ee58B30F9c99E3b52c6DE61C',
      },
      Maxtr1x2061: {
        owner: '0x454574C8AD9706a8fC22dDA71Ce77Cb1CDd5fEB1',
        address: '0xfC7F5dbd4FF88212AE1ab254200D04F3c81D9B58',
      },
      BikesOfBurden: {
        owner: '0xCd49a6c167016fEf9E9d68b8dBC2F4425E9AA7b8',
        address: '0xeDE95AdBAB17d5dd121A9Ce6A9764a5F7a397AE0',
      },
    },
  },
  [CHAIN_IDS.MUMBAI]: {
    DEPOSIT_RATE: 100000,
    WUIT: '0x6e339498Dce86c81F175b0bD12c3a6b7216e24cb',
    MARKET: '0xD39Cf454221404745d7C807f17c8460bE0eC8317',
    PUBLIC_ERC721_TOKEN: '0xf87d74a1B01ce51446F40A1B18dC49da4a806879',
    COLLECTIONS: {
      DyanCat: {
        owner: '0x454574C8AD9706a8fC22dDA71Ce77Cb1CDd5fEB1',
        address: '0x5F3F8ef7630a4FC0DAd482D33178BF5A190a925e',
      },
    },
  },
}

export const DEFAULT_ADDRESS = '0x0000000000000000000000000000000000000000'

export const Collections = {
  '0xCd49a6c167016fEf9E9d68b8dBC2F4425E9AA7b8': '0xd1edA759274915Ac515f42d96BBe9F4b02aE1b76',
  '0x454574C8AD9706a8fC22dDA71Ce77Cb1CDd5fEB1': '0x1Def42fc65c3251087Bb61A410003981bE75e1d8',
}

type CollectionsOfMarket = { address: string; owner: string }[]
export const CollectionsOfMarket = {
  CES: {
    address: '0xd1edA759274915Ac515f42d96BBe9F4b02aE1b76',
    owner: '0xCd49a6c167016fEf9E9d68b8dBC2F4425E9AA7b8',
  },
  MyToken: {
    address: '0x1Def42fc65c3251087Bb61A410003981bE75e1d8',
    owner: '0x454574C8AD9706a8fC22dDA71Ce77Cb1CDd5fEB1',
  },
  SupperIdol: {
    address: '0x9fbC241d05A8c6Ef9324A1229c23f4b8bD09b0Fa',
    owner: '0xf9f0036e2afaf6eeea77e08d1bfa012e1442da3f',
  },
  Wilzard: {
    address: '0x4Fd34fc9eFa5f64cD0aF30bdDf8c42008CeffeFb',
    owner: '0xf9f0036e2afaf6eeea77e08d1bfa012e1442da3f',
  },

  LongLiveNft: {
    address: '0x542F920fCf0CBD1c02Cdff3d630A321Ac704eDa4',
    owner: '0xa61E47Cd253Af02334DA3FDc03d548FF74F86395', //account 5
  },
  EmpressTrash: {
    address: '0xB1759D417821C61AfEEd7B46cbAb6093ed441892',
    owner: '0xa61E47Cd253Af02334DA3FDc03d548FF74F86395', //account 5
  },
  BRAINMELT: {
    address: '0x4d635714967de6bF42A88102b1fdA537c1B2E979',
    owner: '0x93503541f3ee2c41289c94d1e80d051867c7ddb4', //account 6
  },
  AZUKI: {
    address: '0xc9a643a6551a7d19f36dEa439318fE2b1cB86509',
    owner: '0x70c9f7141c86e9d0612a3599ded77669121ca195', //account 7
  },
}
