const { assert, expect } = require("chai");
const { ethers, network, deployments } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const helpers = require("@nomicfoundation/hardhat-network-helpers");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("ProjectFactory Unit Test", () => {
      let projectFactory, owner, badActor, user;

      beforeEach(async () => {
        [owner, user, badActor] = await ethers.getSigners();

        await deployments.fixture("all");

        projectFactory = await ethers.getContract("ProjectFactory");
      });

      describe("#createNewProject", () => {
        it("successfully create a new Project with a token", async () => {
          const requestedFunds = ethers.utils.parseEther("2000");

          const now = await helpers.time.latest();

          const deadline = now + 86400;

          await projectFactory.createNewProject(
            user.address,
            user.address,
            requestedFunds,
            deadline,
            "testProject",
            "TP"
          );

          const deployedProjects =
            await projectFactory.getDeployedProjectContracts();

          assert.equal(deployedProjects.length, 1);
        });
      });
    });
