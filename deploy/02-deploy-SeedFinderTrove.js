const { network, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  const seedTokenDeployment = await deployments.get("SeedToken");

  let DFITokenDeployment;

  if (developmentChains.includes(network.name)) {
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

  await seedToken.updateSeedFinderAddress(deployedSeedFinderTrove.address);
};

module.exports.tags = ["all", "trove"];
