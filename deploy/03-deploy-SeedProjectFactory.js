const { network, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  const seedTokenContract = await ethers.getContract("SeedToken");

  const deployedSeedProject = await deploy("SeedProject", {
    from: deployer,
    log: true,
    args: [],
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  const deployedSeedProjectToken = await deploy("SeedProjectToken", {
    from: deployer,
    log: true,
    args: [],
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  const args = [
    deployedSeedProject.address,
    deployedSeedProjectToken.address,
    seedTokenContract.address,
  ];

  const deployedFactory = await deploy("ProjectFactory", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying ..");
    await verify(deployedSeedProject.address, []);
    await verify(deployedSeedProjectToken.address, []);
    await verify(deployedFactory.address, args);
  }
};

module.exports.tags = ["all", "factory"];
