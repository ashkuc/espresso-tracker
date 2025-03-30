import { Chain } from 'viem'

import { registerCustomArbitrumNetwork } from '@arbitrum/sdk'
import {arbitrumSepolia} from 'wagmi/chains';

export const ashkucTestnet = {
    id: 16_03_2025,
    name: 'Ashkuc Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        public: { http: ['https://testnetrpc.ashkuc.fyi'] },
        default: { http: ['https://testnetrpc.ashkuc.fyi'] },
    },
} as const satisfies Chain


export const registerInArbitrumSdk = () => registerCustomArbitrumNetwork({
    isCustom: true,
    isTestnet: true,
    chainId: ashkucTestnet.id,
    name: ashkucTestnet.name,
    ethBridge: {
        bridge: '0x782c74ff8c3ca05766c9906cc03861a081c3c0c7',
        inbox: '0x8b41696bb731fbcdb6d81fe7f01b5687a47f2fd8',
        sequencerInbox: '0x244b590df2890ddf227b82d68b144ee02fa2d415',
        outbox: '0xC12e567Bd13B19a1DbdD43eB7b70568535cDa522',
        rollup: '0x2d63c172f3695985541Dc679fA38F45D8908fa90',
    },
    parentChainId: arbitrumSepolia.id,
    confirmPeriodBlocks: 1,
}, {throwIfAlreadyRegistered: false})

