const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();

  const { log, deploy } = deployments;

  if (developmentChains.includes(network.name)) {
    log(`Deploy Mock Contracts to ${network.name} ...`);

    await deploy("MockToken", {
      from: deployer,
      log: true,
      args: [],
      waitConfirmations: network.config.blockConfirmations || 1,
    });
  }
};

module.exports.tags = ["all", "mocks"];
