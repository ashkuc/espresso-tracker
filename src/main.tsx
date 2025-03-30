import {Buffer} from 'buffer'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import {WagmiProvider} from 'wagmi'

import App from './App.tsx'
import {config} from './wagmi.ts'

import './index.css'
import {DemoProvider} from '@/hooks/DemoContext.tsx';
import {BalancesProvider} from '@/hooks/BalancesContext.tsx';

globalThis.Buffer = Buffer

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <DemoProvider>
                    <BalancesProvider>
                        <App/>
                    </BalancesProvider>
                </DemoProvider>
            </QueryClientProvider>
        </WagmiProvider>
    </React.StrictMode>,
)
