import React, {useEffect} from 'react'
import {useAccount, useConnect, useDisconnect} from 'wagmi'
import {useDemo} from '@/hooks/DemoContext'
import {Button} from '@/components/ui/button'
import {Badge} from '@/components/ui/badge'
import {Copy} from 'lucide-react'

export const WalletConnectionStatus: React.FC = () => {
    const {setConnected, setAddress} = useDemo()
    const account = useAccount()
    const {disconnect} = useDisconnect()
    const {connectors, connect, status, error} = useConnect()

    useEffect(() => {
        if (account.status === 'connected') {
            setConnected(true)
            setAddress(account.address)
        } else {
            setConnected(false)
            setAddress('')
        }
    }, [account.status, account.address])

    const shortAddress = (addr?: string) =>
        addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '—'

    if (account.status !== 'connected') {
        return (
            <div className="space-y-2">
                {connectors.map((connector) => (
                    <Button
                        key={connector.uid}
                        onClick={() => connect({connector})}
                    >
                        {connector.name}
                    </Button>
                ))}
                {status === 'pending' && <div>Connecting...</div>}
                {error && <div className="text-red-500 text-sm">{error.message}</div>}
            </div>
        )
    }

    return (
        <div className="flex items-center justify-between gap-4 border rounded-lg px-4 py-2">
            <div className="flex items-center gap-2">
                <Badge variant="default">Connected</Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
          {shortAddress(account.address)}
                    <Copy
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => navigator.clipboard.writeText(account.address!)}
                    />
        </span>
            </div>
            <Button variant="outline" size="sm" onClick={() => disconnect()}>
                Disconnect
            </Button>
        </div>
    )
}
