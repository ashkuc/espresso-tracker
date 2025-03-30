import { createContext, useContext, useState, ReactNode } from 'react'

type DemoContextType = {
    isConnected: boolean
    address?: string
    l2Balance?: bigint
    l3Balance?: bigint
    depositTxHash?: string
    transferTxHash?: string
    isConfirmed?: boolean

    setConnected: (val: boolean) => void
    setAddress: (addr: string) => void
    setL2Balance: (b: bigint) => void
    setL3Balance: (b: bigint) => void
    setDepositTxHash: (h: string) => void
    setTransferTxHash: (h: string) => void
    setConfirmed: (v: boolean) => void
}

const DemoContext = createContext<DemoContextType | null>(null)

export const useDemo = () => {
    const ctx = useContext(DemoContext)
    if (!ctx) throw new Error('DemoContext not found')
    return ctx
}

export const DemoProvider = ({ children }: { children: ReactNode }) => {
    const [isConnected, setConnected] = useState(false)
    const [address, setAddress] = useState<string>()
    const [l2Balance, setL2Balance] = useState<bigint>()
    const [l3Balance, setL3Balance] = useState<bigint>()
    const [depositTxHash, setDepositTxHash] = useState<string>()
    const [transferTxHash, setTransferTxHash] = useState<string>()
    const [isConfirmed, setConfirmed] = useState<boolean>()

    return (
        <DemoContext.Provider
            value={{
                isConnected,
                address,
                l2Balance,
                l3Balance,
                depositTxHash,
                transferTxHash,
                isConfirmed,
                setConnected,
                setAddress,
                setL2Balance,
                setL3Balance,
                setDepositTxHash,
                setTransferTxHash,
                setConfirmed,
            }}
        >
            {children}
        </DemoContext.Provider>
    )
}
