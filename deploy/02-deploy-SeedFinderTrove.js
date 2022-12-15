const { network, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  const seedTokenDeployment = await deployments.get("SeedToken");

  let DFITokenDeployment;

  if (developmentChains.includes(network.name) || network.name === "goerli") {
    DFITokenDeployment = await deployments.get("MockToken");
  }

  const args = [DFITokenDeployment.address, seedTokenDeployment.address];

  const deployedSeedFinderTrove = await deploy("SeedFinderTrove", {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  const seedToken = await ethers.getContractAt(
    seedTokenDeployment.abi,
    seedTokenDeployment.address
  );

  const seedFinderAddress = await seedToken.getSeedFinderAddress();

  if (
    seedFinderAddress.toLowerCase() ===
    deployedSeedFinderTrove.address.toLowerCase()
  ) {
    console.log("Seed Finder Trove already be updated correct");
  } else {
    const tx = await seedToken.updateSeedFinderAddress(
      deployedSeedFinderTrove.address
    );

    await tx.wait(2);
  }

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying ..");
    await verify(deployedSeedFinderTrove.address, args);
  }
};

module.exports.tags = ["all", "trove"];
