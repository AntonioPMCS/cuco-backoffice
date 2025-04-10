export const useGasCostEstimator = () => {
  const estimateTransactionCost = async (
    contract: any, // ethers.Contract instance
    methodName: string,
    args: any[],
    overrides: any = {}
  ): Promise<string> => {
    try {
      // Estimate gas
      console.log("Estimating gas for:", methodName, args);
      const gasEstimate:bigint = await contract[methodName].estimateGas(...args, overrides);

      // Get current gas price in GWEI
      const feeData = await contract.runner.getFeeData();
      const gasPrice:bigint = feeData.maxFeePerGas;

      if (!gasPrice) throw new Error("Gas price unavailable");

      // Cost in ETH
      console.log(gasEstimate)
      console.log(gasPrice)
      const costInWei = gasEstimate * gasPrice; // BigNumber
      const costInEth = Number(costInWei.toString()) / 1e18;
      console.log("Cost in Eth: " + costInEth)

      // Fetch ETH price
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const data = await res.json();
      const ethToUsd = data.ethereum.usd;
      console.log("Cost in $: "+(costInEth * ethToUsd).toFixed(5))

      return `$${(costInEth * ethToUsd).toFixed(2)}`;
    } catch (error) {
      console.error("Gas estimation failed:", error);
      return "Unable to estimate cost";
    }
  };

  return { estimateTransactionCost };
};