const { developmentChains } = require("../helper-hardhat-config");

task("mint-DFI", "Mint new DFI Tokens for testing (only hardhat network)")
  .addParam("amount", "Amount of token to mint")
  .setAction(async (taskArgs, hre) => {
    const signer = (await hre.ethers.getSigners())[0];

    const DFITokenDeployment = await hre.deployments.get("MockToken");
    const DFIToken = await hre.ethers.getContractAt(
      DFITokenDeployment.abi,
      DFITokenDeployment.address
    );

    const _amount = hre.ethers.utils.parseEther(taskArgs.amount);

    await DFIToken.mint(signer.address, _amount);

    console.log(
      `Successfully minted ${hre.ethers.utils.formatEther(_amount)} DFI tokens!`
    );
  });
