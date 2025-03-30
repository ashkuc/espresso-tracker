import { createContext, useContext, useState, ReactNode } from 'react'
import {Chain} from 'viem';

type DemoContextType = {
    isConnected: boolean
    address?: string
    l1?: Chain
    l2?: Chain
    l3?: Chain
    setConnected: (val: boolean) => void
    setAddress: (addr: string) => void
    setL1: (chain: Chain) => void
    setL2: (chain: Chain) => void
    setL3: (chain: Chain) => void
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
    const [l1, setL1] = useState<Chain>()
    const [l2, setL2] = useState<Chain>()
    const [l3, setL3] = useState<Chain>()

    return (
        <DemoContext.Provider
            value={{
                isConnected,
                address,
                l1,
                l2,
                l3,
                setConnected,
                setAddress,
                setL1,
                setL2,
                setL3,
            }}
        >
            {children}
        </DemoContext.Provider>
    )
}
