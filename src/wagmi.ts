import {http, createConfig} from 'wagmi'
import {mainnet, sepolia, arbitrum, arbitrumSepolia} from 'wagmi/chains'
import {injected} from 'wagmi/connectors'
import {ashkucTestnet} from './chains/ashkucTestnet';
import {ashkucMainnet} from './chains/ashkucMainnet.ts';

export const config = createConfig({
    chains: [
        mainnet,
        arbitrum,
        sepolia,
        arbitrumSepolia,
        ashkucTestnet,
        ashkucMainnet,
    ],
    connectors: [
        injected(),
        // coinbaseWallet(),
        // walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
    ],
    transports: {
        [mainnet.id]: http(),
        [arbitrum.id]: http(),
        [sepolia.id]: http(),
        [arbitrumSepolia.id]: http(),
        [ashkucTestnet.id]: http(),
        [ashkucMainnet.id]: http(),
    },
})

declare module 'wagmi' {
    interface Register {
        config: typeof config
    }
}
