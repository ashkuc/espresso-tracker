import { Chain } from 'viem'
import {arbitrumSepolia, sepolia} from 'wagmi/chains';
import {ashkucTestnet} from '@/chains/ashkucTestnet.ts';

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

export const availableOptions: Array<RollupChains> = [ashkucRollupConfig]

export const ESPRESSO_MAIN_API_URL = 'https://query.main.net.espresso.network';
export const ESPRESSO_TESTNET_API_URL = 'https://query.decaf.testnet.espresso.network';

export const getEspressoApiUrl = (chainId: string | number): string => {
    switch (chainId.toString()) {
        case ashkucTestnet.id.toString():
            return ESPRESSO_TESTNET_API_URL;
        default:
            throw new Error(`Unsupported chain ID: ${chainId}`);
    }
}
