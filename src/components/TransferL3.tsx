import React, {useState} from 'react'
import {useDemo} from '@/hooks/DemoContext'
import {useBalances} from '@/hooks/BalancesContext'
import {useEthersSigner} from '@/hooks/useEthers'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {ethers} from 'ethers'
import {useChainId} from 'wagmi';
import {EnsureNetwork} from '@/components/EnsureNetwork.tsx';
import {RecipientSelector} from '@/components/RecipientSelector.tsx';
import {EspressoConfirmation} from '@/components/EspressoConfirmation.tsx';
import {useEspressoTracker} from '@/hooks/EspressoTrackerContext.tsx';

export const TransferL3: React.FC = () => {
    const chainId = useChainId()
    const {address, l3} = useDemo()
    const {l3Balance} = useBalances()
    const signer = useEthersSigner({chainId: l3?.id})
    const {startTracking} = useEspressoTracker()

    const [recipient, setRecipient] = useState('')
    const [amount, setAmount] = useState('')
    const [state, setState] = useState<'loading' | 'error' | 'success' | null>(null)
    const [txHash, setTxHash] = useState<string | null>(null)

    const balanceEth = l3Balance ? Number(ethers.utils.formatEther(l3Balance)) : 0
    const maxSendable = Math.max(balanceEth - 0.0001, 0).toFixed(6)

    const handleTransfer = async () => {
        if (!signer || !address || !recipient || !amount || !l3) return

        const value = ethers.utils.parseEther(amount)

        if (l3Balance && value.gt(l3Balance)) {
            console.error('Amount exceeds available balance')
            setState('error')
            return
        }

        setState('loading')
        try {
            const tx = await signer.sendTransaction({
                to: recipient,
                value,
            })

            setTxHash(tx.hash)
            startTracking(tx.hash, l3.id)
            await tx.wait()
            setState('success')
        } catch (err) {
            console.error(err)
            setState('error')
        }
    }

    if (!l3) return null

    return (
        <div className="space-y-3">
            <span className="font-medium text-foreground">Transfer on L3</span>

            {chainId === l3.id && (<>
                <RecipientSelector value={recipient} onChange={(value) => setRecipient(value)}/>
                <Label htmlFor="amount">Amount (ETH)</Label>
                <Input
                    id="amount"
                    type="number"
                    step="0.001"
                    value={amount}
                    placeholder={`max ${maxSendable}`}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={state === 'loading'}
                />

                <Button onClick={handleTransfer} disabled={state === 'loading'}>
                    {state === 'loading' ? 'Transferring...' : 'Transfer'}
                </Button>

                {state === 'success' && (
                    <p className="text-green-600 text-sm">Transfer complete ✅</p>
                )}
                {state === 'error' && (
                    <p className="text-red-500 text-sm">Transfer failed ❌</p>
                )}
                {txHash && l3?.blockExplorers?.default?.url && (
                    <p className="text-xs text-muted-foreground">
                        Tx:{' '}
                        <a
                            href={`${l3.blockExplorers.default?.url}/tx/${txHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="underline"
                        >
                            {txHash.slice(0, 10)}...
                        </a>
                    </p>
                )}
                {txHash && <EspressoConfirmation txHash={txHash} />}
            </>)}
            {chainId !== l3.id && (<EnsureNetwork requiredChain={l3}/>)}
        </div>
    )
}
