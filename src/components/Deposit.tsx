import React, {useEffect, useState} from 'react'
import { useDemo } from '@/hooks/DemoContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEthersProvider, useEthersSigner } from '@/hooks/useEthers'
import {EthBridger, registerCustomArbitrumNetwork} from '@arbitrum/sdk'
import { ethers } from 'ethers'
import {ashkucTestnetArbitrumNetwork} from '@/chains/ashkucTestnet';
import {ashkucMainnetArbitrumNetwork} from '@/chains/ashkucMainnet';
import {useChainId} from 'wagmi';
import {EnsureNetwork} from '@/components/EnsureNetwork.tsx';

export const DepositL2L3: React.FC = () => {
    const { address, l2, l3 } = useDemo()
    const chainId = useChainId()
    const [amount, setAmount] = useState('0.01')
    const [txHash, setTxHash] = useState<string | null>(null)
    const [state, setState] = useState<'loading' | 'error' | 'success' | null>(null)

    const childProvider = useEthersProvider({ chainId: l3?.id })
    const parentSigner = useEthersSigner({ chainId: l2?.id })

    useEffect(() => {
        registerCustomArbitrumNetwork(ashkucTestnetArbitrumNetwork)
        registerCustomArbitrumNetwork(ashkucMainnetArbitrumNetwork)
        console.log('registerInArbitrumSdk')
    }, []);

    const handleDeposit = async () => {
        if (state === 'loading' || !address || !childProvider || !parentSigner) return
        if (!amount || Number(amount) <= 0) {
            setState('error')
            console.error('Invalid deposit amount')
            return
        }

        setState('loading')

        try {
            const bridger = await EthBridger.fromProvider(childProvider)

            const tx = await bridger.deposit({
                parentSigner,
                amount: ethers.utils.parseEther(amount),
            })

            setTxHash(tx.hash)
            await tx.wait()
            setState('success')
        } catch (error) {
            console.error(error)
            setState('error')
        }
    }

    if (!l2 || !l3) return null

    return (
        <div className="space-y-3">
            <span className="font-medium text-foreground">Deposit L2 to L3</span>
            {chainId === l2.id && (<>
                <Label htmlFor="deposit-amount">Amount to deposit (ETH)</Label>
                <Input
                    id="deposit-amount"
                    type="number"
                    step="0.001"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={state === 'loading'}
                />

                <Button onClick={handleDeposit} disabled={state === 'loading'}>
                    {state === 'loading' ? 'Depositing...' : `Deposit ${l2?.name ?? 'L2'} -> ${l3?.name ?? 'L3'}`}
                </Button>

                {state === 'success' && (
                    <p className="text-green-600 text-sm">Deposit complete ✅</p>
                )}

                {state === 'error' && (
                    <p className="text-red-500 text-sm">Deposit failed ❌</p>
                )}

                {txHash && l2?.blockExplorers?.default?.url && (
                    <p className="text-xs text-muted-foreground">
                        Tx:{' '}
                        <a
                            href={`${l2.blockExplorers.default?.url}/tx/${txHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="underline"
                        >
                            {txHash.slice(0, 10)}...
                        </a>
                    </p>
                )}</>)}
            {chainId !== l2.id && (<EnsureNetwork requiredChain={l2} />)}
        </div>
    )
}
