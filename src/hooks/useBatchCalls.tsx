import { Provider as EthCallProvider, Contract as EthCallContract } from "ethcall";
import { Provider } from "ethers";
import Device from "../../abi/Device.json";
import Customer from "../../abi/Customer.json";

export const batchCalls = async (
  ethersProvider:Provider | null, 
  _addresses:string[], 
  _functionNames: string[], 
  _contractName: "Device" | "Customer"
) : Promise<unknown[]> => {

  if (!ethersProvider || _addresses.length === 0 || _functionNames.length === 0) return [];

  const ethCallProvider = new EthCallProvider(1, ethersProvider!);
  let abi;
  if (_contractName === "Customer") {
    abi = Customer.abi;
  } else {
    abi = Device.abi;
  }

  const calls = _addresses.flatMap((address) => {
    const contract = new EthCallContract(address, abi);
    return _functionNames.map((fn) => contract[fn]() );
  });

  try {
    const results = await ethCallProvider.all(calls);
    return results;
    } catch (err) {
      console.error("Multicall failed: ", err);
      return [];
  }
};
