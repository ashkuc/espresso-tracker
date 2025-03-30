// import { Chain } from 'wagmi'
import { Chain } from 'viem'

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
    // blockExplorers: {
    //     etherscan: { name: 'SnowTrace', url: 'https://snowtrace.io' },
    //     default: { name: 'SnowTrace', url: 'https://snowtrace.io' },
    // },
    // contracts: {
    //     multicall3: {
    //         address: '0xca11bde05977b3631167028862be2a173976ca11',
    //         blockCreated: 11_907_934,
    //     },
    // },
} as const satisfies Chain

