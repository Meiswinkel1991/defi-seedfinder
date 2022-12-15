const {
  developmentChains,
  testAccountAddress,
} = require("../helper-hardhat-config");

task("mint-dSeed", "Mint new dSeed Tokens for testing ", async () => {
  const amount = hre.ethers.utils.parseEther("100");

  const signer = (await hre.ethers.getSigners())[0];
  console.log(signer);

  const DFIToken = await hre.ethers.getContract("MockToken");
  await DFIToken.mint(signer.address, amount);

  const seedFinderTrove = await hre.ethers.getContract("SeedFinderTrove");

  await DFIToken.connect(signer).approve(seedFinderTrove.address, amount);
  await seedFinderTrove.connect(signer).swapDFITokenToSeedToken(amount);

  const seedTokenContract = await hre.ethers.getContract("SeedToken");

  await seedTokenContract.transfer(testAccountAddress, amount);

  const balance = await seedTokenContract.balanceOf(testAccountAddress);

  console.log(
    `Transfer ${hre.ethers.utils.formatEther(
      balance
    )} dSeed to ${testAccountAddress}`
  );
});
