import {EspressoApi} from '@/lib/espresso-utils/api.ts';
import {decodeEspressoTransaction} from '@/lib/espresso-utils/decoder.ts';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

    const startFromBlock = await api
        .getStatusBlockHeight()
        .then((b) => b - BigInt(previousBlocksCount))

    let blockHeight = startFromBlock

    while (blockHeight <= startFromBlock + BigInt(maxBlocksCount)) {
        try {
            const response = await api.getTransactionsWithProof(blockHeight, namespace)
            onBlock?.(blockHeight)

            if (response.transactions?.length) {
                for (const transaction of response.transactions) {
                    const decoded = await decodeEspressoTransaction(transaction.payload)

                    for (const tx of decoded) {
                        if (tx.hash === txHash) {
                            return blockHeight
                        }
                    }
                }
            }
        } catch (err) {
            console.error(`Error polling block ${blockHeight}:`, err)
        }

        blockHeight += 1n
        await sleep(pollingInterval)
    }

    return null
}
