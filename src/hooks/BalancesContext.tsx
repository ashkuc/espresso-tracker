import {ReactNode, useEffect, useState, createContext, useContext} from 'react'
import { useDemo } from "./DemoContext"
import { useEthersProvider } from './useEthers'

type BalancesContextType = {
    l1Balance?: bigint
    l2Balance?: bigint
    l3Balance?: bigint
    loading: boolean
    fetch: () => Promise<void>
}

const BalancesContext = createContext<BalancesContextType | null>(null)

export const BalancesProvider = ({ children }: { children: ReactNode }) => {
    const { address, l1, l2, l3 } = useDemo()
    const [l1Balance, setL1Balance] = useState<bigint>()
    const [l2Balance, setL2Balance] = useState<bigint>()
    const [l3Balance, setL3Balance] = useState<bigint>()
    const [loading, setLoading] = useState(false)

    const l1Provider = useEthersProvider({ chainId: l1?.id })
    const l2Provider = useEthersProvider({ chainId: l2?.id })
    const l3Provider = useEthersProvider({ chainId: l3?.id })

    const fetch = async () => {
        if (!address) return
        setLoading(true)

        try {
            if (l1Provider) {
                const balance = await l1Provider?.getBalance(address)
                if (balance) setL1Balance(balance.toBigInt())
            }

            if (l2Provider) {
                const balance = await l2Provider?.getBalance(address)
                if (balance) setL2Balance(balance.toBigInt())
            }

            if (l3Provider) {
                const balance = await l3Provider?.getBalance(address)
                if (balance) setL3Balance(balance.toBigInt())
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetch().catch(console.error)
    }, [address, l1 ,l2, l3])

    return (
        <BalancesContext.Provider
            value={{
                l1Balance,
                l2Balance,
                l3Balance,
                loading,
                fetch,
            }}
        >
            {children}
        </BalancesContext.Provider>
    )
}

export const useBalances = () => {
    const ctx = useContext(BalancesContext)
    if (!ctx) throw new Error('useBalances must be used within BalancesProvider')
    return ctx
}
