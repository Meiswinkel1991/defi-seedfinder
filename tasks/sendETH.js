const {
  developmentChains,
  testAccountAddress,
} = require("../helper-hardhat-config");

task("send-Ether", "send Ether to a test account")
  .addParam("amount", "amount of token to send")
  .setAction(async (taskArgs, hre) => {
    if (!developmentChains.includes(hre.network.name)) {
      console.log(
        `Wrong network. Cant mint DFI tokens. Try to get DFI from faucets...`
      );
    } else {
      const accounts = await hre.ethers.getSigners();

      const signer = accounts[0];

      const amount = hre.ethers.utils.parseEther(taskArgs.amount);

      await signer.sendTransaction({
        to: testAccountAddress,
        value: amount,
      });
    }
  });
