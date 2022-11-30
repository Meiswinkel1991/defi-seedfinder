const { assert, expect } = require("chai");
const { ethers, network, deployments } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("SeedToken Unit Test", () => {
      let owner, badActor, seedToken, seedFinder, tokenAmount;

      beforeEach(async () => {
        [owner, badActor, seedFinder] = await ethers.getSigners();

        await deployments.fixture("all");

        seedToken = await ethers.getContract("SeedToken");

        tokenAmount = ethers.utils.parseEther("100");
      });

      describe("#burn", () => {
        it("successfully burn dSeed Tokens", async () => {
          await seedToken.updateSeedFinderAddress(owner.address);

          await seedToken.mint(owner.address, tokenAmount);

          const _burnAmount = ethers.utils.parseEther("20");

          await seedToken.burn(owner.address, _burnAmount);

          const _expectedBalance = tokenAmount.sub(_burnAmount);

          const _balance = await seedToken.balanceOf(owner.address);

          assert(_balance.eq(_expectedBalance));
        });

        it("can only burn tokens if the caller is the Seedfinder Contract", async () => {
          await seedToken.updateSeedFinderAddress(seedFinder.address);

          await expect(
            seedToken.mint(owner.address, tokenAmount)
          ).to.be.revertedWithCustomError(
            seedToken,
            "SeedToken__CallerIsNotSeedFinder"
          );
        });
      });

      describe("#mint", () => {
        it("successfully mint new dSeed", async () => {
          await seedToken.updateSeedFinderAddress(owner.address);

          await seedToken.mint(owner.address, tokenAmount);

          const _balance = await seedToken.balanceOf(owner.address);

          assert(_balance.eq(tokenAmount));
        });

        it("can only mint if the caller is the SeedFinder Contract", async () => {
          await seedToken.updateSeedFinderAddress(seedFinder.address);

          await expect(
            seedToken.mint(owner.address, tokenAmount)
          ).to.be.revertedWithCustomError(
            seedToken,
            "SeedToken__CallerIsNotSeedFinder"
          );
        });
      });

      describe("#updateSeedFinderAddress", () => {
        it("successfully update the SeedFinder Address", async () => {
          await seedToken.updateSeedFinderAddress(seedFinder.address);

          const _address = await seedToken.getSeedFinderAddress();

          assert.equal(seedFinder.address, _address);
        });

        it("can only update the SeedFinder Address if the Caller is the owner", async () => {
          await expect(
            seedToken
              .connect(badActor)
              .updateSeedFinderAddress(seedFinder.address)
          ).to.be.revertedWith("Ownable: caller is not the owner");
        });
      });
    });
