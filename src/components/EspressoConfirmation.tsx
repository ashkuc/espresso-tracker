import React from 'react'
import { useEspressoConfirmation } from '@/hooks/useEspressoConfirmation'
import { useDemo } from '@/hooks/DemoContext'

type EspressoConfirmationProps = {
    txHash?: string
}

export const EspressoConfirmation: React.FC<EspressoConfirmationProps> = ({ txHash }) => {
    const { l3 } = useDemo()

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

            {error && (
                <div className="text-red-500">
                    ⚠️ Error: {error.message}
                </div>
            )}
        </div>
    )
}
