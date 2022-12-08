const { assert, expect } = require("chai");
const { ethers, network, deployments } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const helpers = require("@nomicfoundation/hardhat-network-helpers");

const duration = 86400; //1d
const reuqestedFunds = ethers.utils.parseEther("1000");
const name = "TestProject";
const symbol = "TP";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("SeedProject Unit Test", () => {
      let seedProject,
        owner,
        user,
        badActor,
        fundingAddress,
        founder,
        projectFactory,
        projectToken;

      beforeEach(async () => {
        [owner, user, badActor, fundingAddress, founder] =
          await ethers.getSigners();

        deployments.fixture("all");

        projectFactory = await ethers.getContract("ProjectFactory");
      });

      describe("#initialize", () => {
        it("successfully set the correct TokenPrice", async () => {
          const deadline = (await helpers.time.latest()) + duration;
          await projectFactory.createNewProject(
            founder.address,
            fundingAddress.address,
            reuqestedFunds,
            deadline,
            name,
            symbol
          );

          const projectAddress =
            projectFactory.getLastDeployedProjectContract();

          const projectContract = await ethers.getContractAt(
            "SeedProject",
            projectAddress
          );

          const _price = await projectContract.getTokenPrice();

          const _expectedPrice = reuqestedFunds.div(
            ethers.utils.parseEther("10000")
          );

          assert(_price.eq(_expectedPrice));
        });

        it("failed to initialize the project twice", async () => {
          const deadline = (await helpers.time.latest()) + duration;
          await projectFactory.createNewProject(
            founder.address,
            fundingAddress.address,
            reuqestedFunds,
            deadline,
            name,
            symbol
          );

          const projectAddress =
            projectFactory.getLastDeployedProjectContract();

          const projectContract = await ethers.getContractAt(
            "SeedProject",
            projectAddress
          );

          await expect(
            projectContract.initialize(
              deadline,
              reuqestedFunds,
              founder.address,
              fundingAddress.address,
              user.address,
              user.address
            )
          ).to.be.revertedWith(
            "Initializable: contract is already initialized"
          );
        });
      });
    });
