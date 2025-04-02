import { Chain } from 'viem'

import {ArbitrumNetwork} from '@arbitrum/sdk'
import {arbitrum} from 'wagmi/chains';

export const ashkucMainnet = {
    id: 2025_0000,
    name: 'Ashkuc Mainnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        public: { http: ['https://rpc.rollup.work'] },
        default: { http: ['https://rpc.rollup.work'] },
    },
} as const satisfies Chain

export const ashkucMainnetArbitrumNetwork: ArbitrumNetwork = {
    isCustom: true,
    isTestnet: false,
    chainId: ashkucMainnet.id,
    name: ashkucMainnet.name,
    ethBridge: {
        bridge: '0xa7169b6FFA61104f34F15f558aE2B0bC6B7E2172',
        inbox: '0x87C645986a54DE6b1AB0ff24a9f86854882317A1',
        sequencerInbox: '0xB2f931a4Df8f2Db87E3d5f63bD43273F59349681',
        outbox: '0x81E52746ca02776555eD5B298B3DB8D38E3a568e',
        rollup: '0x3C393af6ee6F2c6E8279c77aDeBF85A7580fb9EA',
    },
    parentChainId: arbitrum.id,
    confirmPeriodBlocks: 1,
}
