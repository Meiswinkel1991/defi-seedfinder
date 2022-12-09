const { assert, expect, use } = require("chai");
const { ethers, network, deployments } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const helpers = require("@nomicfoundation/hardhat-network-helpers");

const duration = 86400; //1d
const requestedFunds = ethers.utils.parseEther("1000");
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
            requestedFunds,
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

          const _expectedPrice = requestedFunds.div(
            ethers.utils.parseEther("10000")
          );

          assert(_price.eq(_expectedPrice));
        });

        it("failed to initialize the project twice", async () => {
          const deadline = (await helpers.time.latest()) + duration;
          await projectFactory.createNewProject(
            founder.address,
            fundingAddress.address,
            requestedFunds,
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
              requestedFunds,
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

      describe("#swapDSEEDToProjectToken", () => {
        let tokenAmount, projectContract, DUSDToken, dSeed;

        beforeEach(async () => {
          //mint DUSD for the user

          DUSDToken = await ethers.getContract("MockToken");

          tokenAmount = ethers.utils.parseEther("100");

          await DUSDToken.connect(user).mint(user.address, tokenAmount);

          // create a new project

          const deadline = (await helpers.time.latest()) + duration;
          await projectFactory.createNewProject(
            founder.address,
            fundingAddress.address,
            requestedFunds,
            deadline,
            name,
            symbol
          );

          const projectAddress =
            projectFactory.getLastDeployedProjectContract();

          projectContract = await ethers.getContractAt(
            "SeedProject",
            projectAddress
          );

          //swap DUSD to dSeed

          dSeed = await ethers.getContract("SeedToken");

          const trove = await ethers.getContract("SeedFinderTrove");

          await DUSDToken.connect(user).approve(trove.address, tokenAmount);

          await trove.connect(user).swapDFITokenToSeedToken(tokenAmount);
        });

        it("successfully swap dSeed to the project token", async () => {
          await dSeed
            .connect(user)
            .approve(projectContract.address, tokenAmount);

          const projectTokenAddress =
            await projectContract.getProjectTokenAddress();

          const projectToken = await ethers.getContractAt(
            "SeedProjectToken",
            projectTokenAddress
          );

          await projectContract
            .connect(user)
            .swapDSEEDToProjectToken(tokenAmount);

          _balance = await projectToken.balanceOf(user.address);

          const _price = await projectContract.getTokenPrice();

          assert(_balance.eq(tokenAmount.div(_price)));
        });
      });
    });
