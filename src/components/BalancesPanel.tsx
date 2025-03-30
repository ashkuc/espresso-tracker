import React from 'react'
import {useDemo} from '@/hooks/DemoContext'
import {useBalances} from '@/hooks/BalancesContext'
import {Button} from '@/components/ui/button'
import {ethers} from 'ethers';

export const BalancesPanel: React.FC = () => {
    const {l1, l2, l3} = useDemo()
    const {l1Balance, l2Balance, l3Balance, loading, fetch} = useBalances()

    const format = (value?: bigint) => value ? `${ethers.utils.formatEther(value)} ETH` : '—'

    return (
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-foreground">Balances</span>
                <Button size="sm" variant="outline" onClick={fetch} disabled={loading}>
                    {loading ? 'Refreshing...' : 'Refresh'}
                </Button>
            </div>

            <div>
                <strong>{l1?.name ?? 'L1'}:</strong>{' '}
                {loading ? 'Loading...' : format(l1Balance)}
            </div>
            <div>
                <strong>{l2?.name ?? 'L2'}:</strong>{' '}
                {loading ? 'Loading...' : format(l2Balance)}
            </div>
            <div>
                <strong>{l3?.name ?? 'L3'}:</strong>{' '}
                {loading ? 'Loading...' : format(l3Balance)}
            </div>
        </div>
    )
}
