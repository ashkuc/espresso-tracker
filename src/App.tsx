import {WalletConnectionStatus} from '@/components/WalletConnectionStatus'
import {RollupSelector} from '@/components/RollupSelector.tsx';
import {BalancesPanel} from '@/components/BalancesPanel.tsx';
import {DepositL2L3} from '@/components/Deposit.tsx';
import {useDemo} from '@/hooks/DemoContext.tsx';
import {useBalances} from '@/hooks/BalancesContext.tsx';
import {TransferL3} from '@/components/TransferL3.tsx';

export default function App() {
    const {isConnected, l1, l2, l3 } = useDemo()
    const { l2Balance, l3Balance } = useBalances()

    return (
        <main className="max-w-xl mx-auto p-6 space-y-6">
            <WalletConnectionStatus/>

            {isConnected && <RollupSelector />}
            {isConnected && l1 && l2 && l3 && <BalancesPanel/>}
            {isConnected && l2 && l3 && !!l2Balance && <DepositL2L3/>}
            {isConnected && l3 && !!l3Balance && <TransferL3/>}
        </main>
    )
}
