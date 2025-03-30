import {useEffect, useState} from 'react';
import {useEthersProvider} from '@/hooks/useEthers.ts';
import {ethers} from 'ethers';

export const useBalance = (address: string, chainId?: number) => {
    const provider = useEthersProvider({ chainId });
    const [balance, setBalance] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        reloadBalance().catch(console.error);
    }, [provider, address]);

    const reloadBalance = async (): Promise<string | null> => {
        if (!provider || !address) return null;

        setLoading(true);

        try {
            const balance = await provider.getBalance(address);
            const formattedBalance = ethers.utils.formatEther(balance);
            setBalance(formattedBalance);

            return formattedBalance;
        } catch (error) {
            console.error('Error fetching balance:', error);
            setBalance(null);
            return null;
        } finally {
            setLoading(false);
        }
    }

    return { balance, loading, reloadBalance }
}
