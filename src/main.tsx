import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes/Router.tsx'
import WalletProvider from './context/WalletProvider.tsx'
import BlockchainProvider from './context/BlockchainProvider.tsx'

createRoot(document.getElementById('root')!).render(
  //<StrictMode>
    <WalletProvider>
      <BlockchainProvider>
        <RouterProvider router={router} />
      </BlockchainProvider>
    </WalletProvider>
  //</StrictMode>,
)
