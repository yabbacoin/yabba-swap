import type { AppProps } from 'next/app'
import { useMemo } from 'react'

import {
  ConnectionProvider,
  WalletProvider
} from '@solana/wallet-adapter-react'

import {
  WalletModalProvider
} from '@solana/wallet-adapter-react-ui'

import {
  PhantomWalletAdapter
} from '@solana/wallet-adapter-wallets'

import '@solana/wallet-adapter-react-ui/styles.css'

export default function App({ Component, pageProps }: AppProps) {
  const endpoint = useMemo(
    () => 'https://api.mainnet-beta.solana.com',
    []
  )

  const wallets = useMemo(
    () => [new PhantomWalletAdapter()],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Component {...pageProps} />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}