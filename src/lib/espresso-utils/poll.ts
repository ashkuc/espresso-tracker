import { EspressoApi } from '@/lib/espresso-utils/api'
import { decodeEspressoTransaction } from '@/lib/espresso-utils/decoder'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

type PollParams = {
    txHash: string
    namespace: number
    apiUrl: string
    maxBlocksCount: number
    previousBlocksCount: number
    pollingInterval: number
    onBlock?: (block: bigint) => void
}

export const pollEspresso = async ({
    txHash,
    namespace,
    apiUrl,
    maxBlocksCount,
    previousBlocksCount,
    pollingInterval,
    onBlock,
}: PollParams): Promise<bigint | null> => {
    const api = new EspressoApi(apiUrl)

    const headAtStart = await api.getStatusBlockHeight()
    const startFromBlock = headAtStart - BigInt(previousBlocksCount)
    const maxTargetBlock = startFromBlock + BigInt(maxBlocksCount)

    let lastProcessedBlock = startFromBlock

    while (true) {
        console.log('🌀 Starting polling loop from block', lastProcessedBlock)

        let currentHead: bigint
        try {
            currentHead = await api.getStatusBlockHeight()
        } catch (err) {
            console.error('❌ Failed to fetch head block:', err)
            await sleep(pollingInterval)
            continue
        }

        const toBlock = currentHead - 1n
        if (toBlock > maxTargetBlock) {
            console.warn('🚫 Reached maxTargetBlock limit')
            return null
        }

        let newLastProcessedBlock = lastProcessedBlock

        for (let blockHeight = lastProcessedBlock; blockHeight <= toBlock; blockHeight++) {
            try {
                const response = await api.getTransactionsWithProof(blockHeight, namespace)
                onBlock?.(blockHeight)
                console.log(`📦 Polling block ${blockHeight}...`)

                if (!response.transactions?.length) {
                    newLastProcessedBlock = blockHeight + 1n
                    continue
                }

                for (const transaction of response.transactions) {
                    const decoded = await decodeEspressoTransaction(transaction.payload)

                    for (const tx of decoded) {
                        if (tx.hash === txHash) {
                            return blockHeight
                        }
                    }
                }

                newLastProcessedBlock = blockHeight + 1n
            } catch (err) {
                console.error(`⚠️ Error polling block ${blockHeight}:`, err)
                break
            }
        }

        lastProcessedBlock = newLastProcessedBlock

        await sleep(pollingInterval)
    }
}
