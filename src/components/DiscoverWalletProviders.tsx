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
          <button key={provider.info.uuid} onClick={() => handleClick(provider)}
           className="w-full flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-900 font-medium">{provider.info.name}</span>
              <img src={provider.info.icon} alt={provider.info.name}
                    width={24} height={24} className="rounded-full"
              />
            </div>
          </button>
        )) :
          <div>
            No wallet extensions found
          </div>
      }
    </div>
  )
}