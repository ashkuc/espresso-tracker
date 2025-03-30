import { createContext, useContext, useState, useRef, ReactNode } from 'react'
import { pollEspresso } from '@/lib/espresso-utils/poll'
import { getEspressoApiUrl } from '@/chains'

export type TrackEntry = {
    hash: string
    namespace: number
    currentBlock: bigint | null
    confirmedBlock?: bigint | null
    loading: boolean
    error?: Error
}

export type EspressoTrackerContextType = {
    hashToBlocks: Record<string, TrackEntry>
    startTracking: (hash: string, namespace: number) => void
}

const EspressoTrackerContext = createContext<EspressoTrackerContextType | null>(null)

export const useEspressoTracker = () => {
    const ctx = useContext(EspressoTrackerContext)
    if (!ctx) throw new Error('useEspressoTracker must be used within EspressoTrackerProvider')
    return ctx
}

const STEP_BACK_FROM_HEADER = 10
const MAX_BLOCKS = 300
const INTERVAL = 5000

export const EspressoTrackerProvider = ({ children }: { children: ReactNode }) => {
    const [hashToBlocks, setHashToBlocks] = useState<Record<string, TrackEntry>>({})
    const trackingRefs = useRef<Record<string, boolean>>({})

    const startTracking = (hash: string, namespace: number) => {
        const key = `${namespace}:${hash}`
        if (trackingRefs.current[key]) return // already tracking

        trackingRefs.current[key] = true

        const apiUrl = getEspressoApiUrl(namespace)
        if (!apiUrl) return

        setHashToBlocks((prev) => ({
            ...prev,
            [hash]: {
                hash,
                namespace,
                currentBlock: null,
                loading: true,
            },
        }));

        pollEspresso({
            txHash: hash,
            namespace,
            apiUrl,
            pollingInterval: INTERVAL,
            maxBlocksCount: MAX_BLOCKS,
            previousBlocksCount: STEP_BACK_FROM_HEADER,
            onBlock: (block) => {
                setHashToBlocks((prev) => ({
                    ...prev,
                    [hash]: {
                        ...prev[hash],
                        currentBlock: block,
                    },
                }))
            },
        })
            .then((confirmedBlock) => {
                setHashToBlocks((prev) => ({
                    ...prev,
                    [hash]: {
                        ...prev[hash],
                        confirmedBlock,
                        loading: false,
                    },
                }))
            })
            .catch((err) => {
                setHashToBlocks((prev) => ({
                    ...prev,
                    [hash]: {
                        ...prev[hash],
                        error: err,
                        loading: false,
                    },
                }))
            })
    }

    return (
        <EspressoTrackerContext.Provider value={{ hashToBlocks, startTracking }}>
            {children}
        </EspressoTrackerContext.Provider>
    )
}
