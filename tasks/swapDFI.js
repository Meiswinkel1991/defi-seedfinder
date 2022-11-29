const { developmentChains } = require("../helper-hardhat-config");

task("swap-DFI", "Swap DFI tokens to dSeed Tokens")
  .addParam("amount", "The amount wanth to swap")
  .setAction(async (taskArgs, hre) => {
    //get the DeFiSeedFinder contract

    const seedFinderDeployment = await hre.deployments.get("DeFiSeedFinder");

    const seedFinderContract = await hre.ethers.getContractAt(
      seedFinderDeployment.abi,
      seedFinderDeployment.address
    );

    const _amount = hre.ethers.utils.parseEther(taskArgs.amount);

    // Check the amount of the signer

    const signer = await hre.ethers.getSigner();
    if (developmentChains.includes(hre.network.name)) {
      const DFITokenDeployment = await hre.deployments.get("MockToken");
      const DFITokenContract = await hre.ethers.getContractAt(
        DFITokenDeployment.abi,
        DFITokenDeployment.address
      );
      const _balance = await DFITokenContract.balanceOf(signer.address);

      if (_balance.lt(_amount)) {
        console.log(
          `Not enough DFI to swap. Only have ${hre.ethers.utils.formatEther(
            _balance
          )} DFI...`
        );
      } else {
        await DFITokenContract.approve(seedFinderContract.address, _amount);

        await seedFinderContract.swapDFITokenToSeedToken(_amount);
      }
    }
  });
