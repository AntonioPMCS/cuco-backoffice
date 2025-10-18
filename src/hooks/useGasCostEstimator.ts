export const useGasCostEstimator = () => {
  
  const estimateTransactionCost = async (
    contract: any, // ethers.Contract instance
    methodName: string,
    args: any[],
    overrides: any = {}
  ): Promise<{ethereum: string, polygon: string}> => {
    try {
      // Estimate gas
      const gasEstimate:bigint = await contract[methodName].estimateGas(...args, overrides);

      // ETHEREUM 
      // Get current ETH gas price in GWEI
      const feeData = await contract.runner.getFeeData();
      const gasPrice:bigint = feeData.maxFeePerGas;

      if (!gasPrice) throw new Error("Gas price unavailable");

      // Cost in ETH
      const costInWei = gasEstimate * gasPrice; // BigNumber
      const costInEth = Number(costInWei.toString()) / 1e18;

      // Fetch ETH price
      let res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      let data = await res.json();
      const ethToUsd = data.ethereum.usd;
      const ethereumCost = (costInEth * ethToUsd).toFixed(5)

      // POLYGON 
      res = await fetch(
        "https://api.polygonscan.com/api?module=gastracker&action=gasoracle&apikey=YourApiKeyToken"
      )
      data = await res.json()
      const polygonGasPrice:number = Number(data.result.ProposeGasPrice);

      const polygonCostInGwei = Number(gasEstimate) * polygonGasPrice;
      const polygonCostInPol = polygonCostInGwei / 1e9

      // Fetch Polygon price
      res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd"
      );
      data = await res.json();
      const polToUsd = data["matic-network"].usd;
      const polygonCost = (Number(polygonCostInPol) * polToUsd).toFixed(5)

      return {ethereum: ethereumCost.toString(), polygon: polygonCost.toString()};
    } catch (error) {
      throw Error("Gas estimation failed");
    }
  };

  return { estimateTransactionCost };
};