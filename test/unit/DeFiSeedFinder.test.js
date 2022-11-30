const { assert, expect } = require("chai");
const { ethers, network, deployments } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("DeFiSeedFinder Unit Test", () => {
      let seedToken, DFIToken, seedFinder, owner, badActor, user, tokenAmount;

      beforeEach(async () => {
        [owner, user, badActor] = await ethers.getSigners();

        await deployments.fixture("all");

        seedToken = await ethers.getContract("SeedToken");
        DFIToken = await ethers.getContract("MockToken");
        seedFinder = await ethers.getContract("DeFiSeedFinder");

        await seedToken.updateSeedFinderAddress(seedFinder.address);

        tokenAmount = ethers.utils.parseEther("100");

        const accounts = await ethers.getSigners();
        for (let i = 0; i < accounts.length; i++) {
          await DFIToken.mint(accounts[i].address, tokenAmount);
        }
      });

      describe("#swapDFITokenToSeedToken", async () => {
        it("successfully swap DFI Tokens to Seed Tokens", async () => {
          await DFIToken.connect(user).approve(seedFinder.address, tokenAmount);

          await seedFinder.connect(user).swapDFITokenToSeedToken(tokenAmount);

          const _balanceSeedTokens = await seedToken.balanceOf(user.address);

          assert(_balanceSeedTokens.eq(tokenAmount));
        });

        it("successfully emit an event after swapping DFI Tokens", async () => {
          await DFIToken.connect(user).approve(seedFinder.address, tokenAmount);
          await expect(
            seedFinder.connect(user).swapDFITokenToSeedToken(tokenAmount)
          )
            .to.emit(seedFinder, "TokenSwap")
            .withArgs(DFIToken.address, seedToken.address, tokenAmount);
        });

        it("failed swap with not enough allowable tokens", async () => {
          await DFIToken.connect(user).approve(
            seedFinder.address,
            tokenAmount.div(ethers.constants.Two)
          );

          await expect(
            seedFinder.connect(user).swapDFITokenToSeedToken(tokenAmount)
          ).to.be.revertedWithCustomError(
            seedFinder,
            "DeFiSeedFinder__NotEnoughAllowance"
          );
        });
      });
    });
