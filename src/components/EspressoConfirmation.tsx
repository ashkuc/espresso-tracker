import React, { useMemo } from 'react'
import { useDemo } from '@/hooks/DemoContext'
import { getEspressoBlockExplorerUrl } from '@/chains'
import {useEspressoTracker} from '@/hooks/EspressoTrackerContext.tsx';

type EspressoConfirmationProps = {
    txHash?: string
}

export const EspressoConfirmation: React.FC<EspressoConfirmationProps> = ({ txHash }) => {
    const { l3 } = useDemo()
    const {hashToBlocks} = useEspressoTracker()

    const blockExplorerUrl = useMemo(() => {
        return !l3 ? '' : getEspressoBlockExplorerUrl(l3.id)
    }, [l3])

    const txInfo = useMemo(() => {
        if (!txHash) return null
        return hashToBlocks[txHash] || null
    }, [hashToBlocks, txHash])

    if (!txInfo) return null

    return (
        <div className="text-sm space-y-1 border rounded-md p-3 bg-muted/30">
            <div>
                Transaction:{' '}
                <span className="font-mono text-muted-foreground">
                    {txInfo.hash.slice(0, 10)}...
                </span>
            </div>

            {txInfo.currentBlock !== null && (
                <div className="text-muted-foreground">
                    ⛏️ Checked up to block{' '}
                    <span className="font-semibold">{txInfo.currentBlock.toString()}</span>
                </div>
            )}

            {txInfo.loading && (
                <div className="text-yellow-500">⏳ Searching for confirmation...</div>
            )}

            {!!txInfo.confirmedBlock && (
                <div className="text-green-600">
                    ✅ Confirmed in block {txInfo.confirmedBlock.toString()}
                </div>
            )}

            {!!txInfo.confirmedBlock && blockExplorerUrl && (
                <div className="text-sm text-muted-foreground">
                    <a
                        href={`${blockExplorerUrl}/block/${txInfo.confirmedBlock}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                    >
                        View on block explorer
                    </a>
                </div>
            )}

            {txInfo.error && (
                <div className="text-red-500">
                    ⚠️ Error: {txInfo.error.message}
                </div>
            )}
        </div>
    )
}
