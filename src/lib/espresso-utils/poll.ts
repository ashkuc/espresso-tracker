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

    const headBlock = await api.getStatusBlockHeight()
    const fromBlock = headBlock - BigInt(previousBlocksCount)

    let lastProcessedBlock = fromBlock
    let currentHead = headBlock

    while (true) {
        try {
            currentHead = await api.getStatusBlockHeight()
        } catch (err) {
            console.error('❌ Failed to fetch head block:', err)
            await sleep(pollingInterval)
            continue
        }

        const maxTarget = fromBlock + BigInt(maxBlocksCount)
        const toBlock = currentHead < maxTarget ? currentHead : maxTarget

        if (lastProcessedBlock > toBlock) {
            await sleep(pollingInterval)
            continue
        }

        for (
            let blockHeight = lastProcessedBlock;
            blockHeight <= toBlock;
            blockHeight++
        ) {
            try {
                const response = await api.getTransactionsWithProof(blockHeight, namespace)
                onBlock?.(blockHeight)

                if (!response.transactions?.length) continue

                for (const transaction of response.transactions) {
                    const decoded = await decodeEspressoTransaction(transaction.payload)

                    for (const tx of decoded) {
                        if (tx.hash === txHash) {
                            return blockHeight
                        }
                    }
                }
            } catch (err) {
                console.error(`⚠️ Error polling block ${blockHeight}:`, err)
                break
            }

            lastProcessedBlock = blockHeight + 1n
        }

        await sleep(pollingInterval)
    }
}
