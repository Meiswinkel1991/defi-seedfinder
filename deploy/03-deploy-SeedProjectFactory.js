const { network, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

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

  const args = [deployedSeedProject.address, deployedSeedProjectToken.address];

  await deploy("ProjectFactory", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
};

module.exports.tags = ["all", "factory"];
