import { Chain } from 'viem'
import {arbitrumSepolia, sepolia, mainnet, arbitrum} from 'wagmi/chains';
import {ashkucTestnet} from '@/chains/ashkucTestnet';
import {ashkucMainnet} from '@/chains/ashkucMainnet';

export type RollupChains = {
    l1: Chain
    l2: Chain
    l3: Chain
}

export const ashkucRollupConfig: RollupChains = {
    l1: sepolia,
    l2: arbitrumSepolia,
    l3: ashkucTestnet,
}

export const ashkucMainnetRollupConfig: RollupChains = {
    l1: mainnet,
    l2: arbitrum,
    l3: ashkucMainnet,
}

export const availableOptions: Array<RollupChains> = [ashkucRollupConfig, ashkucMainnetRollupConfig]

export const ESPRESSO_MAIN_API_URL = 'https://query.main.net.espresso.network';
export const ESPRESSO_TESTNET_API_URL = 'https://query.decaf.testnet.espresso.network';

export const ESPRESSO_MAIN_BLOCK_EXPLORER_URL = 'https://explorer.main.net.espresso.network';
export const ESPRESSO_TESTNET_BLOCK_EXPLORER_URL = 'https://explorer.decaf.testnet.espresso.network';

export const getEspressoApiUrl = (chainId: string | number): string => {
    switch (chainId.toString()) {
        case ashkucTestnet.id.toString():
            return ESPRESSO_TESTNET_API_URL;
        case ashkucMainnet.id.toString():
            return ESPRESSO_MAIN_API_URL;
        default:
            return ''
    }
}

export const getEspressoBlockExplorerUrl = (chainId: string | number): string => {
    switch (chainId.toString()) {
        case ashkucTestnet.id.toString():
            return ESPRESSO_TESTNET_BLOCK_EXPLORER_URL;
        case ashkucMainnet.id.toString():
            return ESPRESSO_MAIN_BLOCK_EXPLORER_URL;
        default:
            return ''
    }
}
