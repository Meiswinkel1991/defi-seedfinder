const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();

  const { log, deploy } = deployments;

  let deployedMockToken;

  if (developmentChains.includes(network.name) || network.name === "goerli") {
    log(`Deploy Mock Contracts to ${network.name} ...`);

    deployedMockToken = await deploy("MockToken", {
      from: deployer,
      log: true,
      args: [],
      waitConfirmations: network.config.blockConfirmations || 1,
    });
  }

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying ..");
    await verify(deployedMockToken.address, []);
  }
};

module.exports.tags = ["all", "mocks"];
