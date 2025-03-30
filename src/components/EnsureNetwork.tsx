import { useSwitchChain, useChainId } from 'wagmi'
import { Button } from '@/components/ui/button'
import {FC, useMemo} from 'react';
import {Chain} from 'viem';

type EnsureNetworkProps = {
    requiredChain: Chain
}

export const EnsureNetwork: FC<EnsureNetworkProps> = ({ requiredChain }) => {
    const chainId = useChainId()
    const {switchChainAsync, chains} = useSwitchChain()

    if (chainId === requiredChain.id) return null

    const currentChain = useMemo(() => {
        return chains.find(chain => chain.id === chainId)
    }, [chainId, chains])

    return (
        <div className="bg-yellow-100 border border-yellow-300 rounded-md p-3 text-sm text-yellow-800 space-y-2">
            <div>
                You're connected to <strong>{currentChain?.name ?? 'unknown'}</strong>, but this action requires{' '}
                <strong>network {requiredChain.name ?? requiredChain.id}</strong>.
            </div>
            <Button
                variant="outline"
                onClick={() => switchChainAsync({chainId: requiredChain.id as any})}
            >
                Switch Network
            </Button>
        </div>
    )
}
