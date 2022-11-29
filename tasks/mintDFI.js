const { developmentChains } = require("../helper-hardhat-config");

task("mint-DFI", "Mint new DFI Tokens for testing (only hardhat network)")
  .addParam("amount", "Amount of token to mint")
  .setAction(async (taskArgs, hre) => {
    if (!developmentChains.includes(hre.network.name)) {
      console.log(
        `Wrong network. Cant mint DFI tokens. Try to get DFI from faucets...`
      );
    } else {
      const signer = await hre.ethers.getSigner();

      const DFITokenDeployment = await hre.deployments.get("MockToken");
      const DFIToken = await hre.ethers.getContractAt(
        DFITokenDeployment.abi,
        DFITokenDeployment.address
      );

      const _amount = hre.ethers.utils.parseEther(taskArgs.amount);

      await DFIToken.mint(signer.address, _amount);

      console.log(
        `Successfully minted ${hre.ethers.utils.formatEther(
          _amount
        )} DFI tokens!`
      );
    }
  });
