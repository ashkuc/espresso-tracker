import {useEffect, useState, useRef} from 'react'
import {getEspressoApiUrl} from '@/chains';
import {pollEspresso} from '@/lib/espresso-utils/poll'

const STEP_BACK_FROM_HEADER = 10

type UseEspressoConfirmationArgs = {
    txHash: string
    namespace: number
    pollingInterval?: number
    maxBlocksCount?: number
    previousBlocksCount?: number
}

export const useEspressoConfirmation = ({
                                            txHash,
                                            namespace,
                                            pollingInterval = 1000,
                                            maxBlocksCount = 300,
                                            previousBlocksCount = STEP_BACK_FROM_HEADER,
                                        }: UseEspressoConfirmationArgs) => {
    const [currentBlock, setCurrentBlock] = useState<bigint | null>(null)
    const [confirmedBlock, setConfirmedBlock] = useState<bigint | null>(null)
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const stopRef = useRef(false)

    useEffect(() => {
        if (!txHash || stopRef.current) return
        const espressoApiUrl = getEspressoApiUrl(namespace)
        if (!espressoApiUrl) return

        stopRef.current = false
        setLoading(true)

        pollEspresso({
            txHash,
            namespace,
            apiUrl: espressoApiUrl,
            pollingInterval,
            maxBlocksCount,
            previousBlocksCount,
            onBlock: (b) => setCurrentBlock(b),
        })
            .then(setConfirmedBlock)
            .catch(setError)
            .finally(() => setLoading(false))

        return () => {
            stopRef.current = true
        }
    }, [txHash])

    return {
        isConfirmed: !!confirmedBlock,
        confirmedBlock,
        currentBlock,
        isLoading,
        error,
    }
}
