import { useWalletProviders } from "../hooks/useWalletProviders"

interface DiscoverWalletProvidersProps {
  handleClick: (provider: EIP6963ProviderDetail) => void;
}

export const DiscoverWalletProviders = ({handleClick}:DiscoverWalletProvidersProps) => {
  const providers = useWalletProviders().providers;

  // Display detected providers as connect buttons.
  return (
    <div>
      {
        providers.length > 0 ? providers.map((provider: EIP6963ProviderDetail) => (
          <button key={provider.info.uuid} onClick={() => handleClick(provider)} >
            <img src={provider.info.icon} alt={provider.info.name} />
            <div>{provider.info.name}</div>
          </button>
        )) :
          <div>
            No wallet extensions found
          </div>
      }
    </div>
  )
}