import {useEthersProvider, useEthersSigner} from '@/hooks/useEthers.ts';
import {useMemo, useState} from 'react';
import ethers from 'ethers';
import { EthBridger } from '@arbitrum/sdk'

type UseDepositParams = {
    childChainId: number
    parentChainId: number
}

type MakeDepositParams = {
    amount: string
    recipient: string
}

export const useDeposit = (params: UseDepositParams) => {
    const { childChainId, parentChainId } = params

    const childProvider = useEthersProvider({chainId: childChainId})
    const parentSigner = useEthersSigner({chainId: parentChainId})
    const [state, setState] = useState<'loading' | 'error' | 'success' | null>(null)

    const isReady = useMemo(() => {
        return !!childProvider && !!parentSigner
    }, [childProvider, parentSigner])

    const makeDeposit = async (params: MakeDepositParams) => {
        if (!childProvider || !parentSigner) throw new Error('provider not ready')
        if (state === 'loading') throw new Error('is processing')

        try {
            setState('loading')
            const bridger = await EthBridger.fromProvider(childProvider!)

            const tx = await bridger.deposit({
                parentSigner,
                amount: ethers.utils.parseEther(params.amount),
            })

            await tx.wait()
            setState('success')
        } catch (error) {
            console.error(error)
            setState('error')
        }
    }

    return {
        isReady,
        makeDeposit,
        state,
        setState,
    }
}
