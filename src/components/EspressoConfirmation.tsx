import React, {useMemo} from 'react'
import {useEspressoConfirmation} from '@/hooks/useEspressoConfirmation'
import {useDemo} from '@/hooks/DemoContext'
import {getEspressoBlockExplorerUrl} from '@/chains';

type EspressoConfirmationProps = {
    txHash?: string
}

export const EspressoConfirmation: React.FC<EspressoConfirmationProps> = ({txHash}) => {
    const {l3} = useDemo()

    const {
        isConfirmed,
        confirmedBlock,
        currentBlock,
        isLoading,
        error,
    } = useEspressoConfirmation({
        txHash: txHash || '',
        namespace: l3?.id ?? 0,
    })

    const blockExplorerUrl = useMemo(() => {
        return !l3 ? '' : getEspressoBlockExplorerUrl(l3.id);
    }, [l3])

    if (!txHash) return null

    return (
        <div className="text-sm space-y-1 border rounded-md p-3 bg-muted/30">
            <div>
                Transaction:{' '}
                <span className="font-mono text-muted-foreground">
          {txHash.slice(0, 10)}...
        </span>
            </div>

            {currentBlock !== null && (
                <div className="text-muted-foreground">
                    ⛏️ Checked up to block{' '}
                    <span className="font-semibold">{currentBlock.toString()}</span>
                </div>
            )}

            {isLoading && (
                <div className="text-yellow-500">⏳ Searching for confirmation...</div>
            )}

            {isConfirmed && (
                <div className="text-green-600">
                    ✅ Confirmed in block {confirmedBlock?.toString()}
                </div>
            )}

            {isConfirmed && !!confirmedBlock && blockExplorerUrl && (
                <div className="text-sm text-muted-foreground">
                    <a
                        href={`${blockExplorerUrl}/block/${confirmedBlock}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                    >
                        View on block explorer
                    </a>
                </div>
            )}

            {error && (
                <div className="text-red-500">
                    ⚠️ Error: {error.message}
                </div>
            )}
        </div>
    )
}
