/// <reference types="vite/client" />
/// <reference types="vite/client" />

interface EIP6963ProviderInfo {
  rdns: string; // Reverse DNS identifier, e.g., "com.metamask"
  uuid: string; // Unique identifier for the provider instance
  name: string; // Display name (e.g., "MetaMask")
  icon: string; // Wallet logo URL  
}

interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo
  // The & below extends the provider type to include a .on member
  provider: EIP1193Provider 
    & { on: (event: string, callback: (data: any) => void) => void }; // Cast to include `on`
}

type EIP6963AnnounceProviderEvent = {
  detail: {
    info: EIP6963ProviderInfo
    provider: Readonly<EIP1193Provider>
  }
}

interface EIP1193Provider {
  isStatus?: boolean
  host?: string
  path?: string
  sendAsync?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: Error | null, response: unknown) => void
  ) => void
  send?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: Error | null, response: unknown) => void
  ) => void
  request: (request: {
    method: string
    params?: Array<unknown>
  }) => Promise<unknown>
}