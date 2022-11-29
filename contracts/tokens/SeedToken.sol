// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error SeedToken__CallerIsNotSeedFinder();

contract SeedToken is ERC20, ERC20Permit, Ownable {
    /* ====== State Variables ====== */
    address private seedFinderAddress;

    /* ====== Functions ====== */

    constructor() ERC20("dSEED", "dSEED") ERC20Permit("dSEED") {}

    function mint(address to, uint256 amount) external {
        _requireCallerIsSeedFinder();
        _mint(to, amount);
    }

    function burn(address _account, uint256 _amount) external {
        _requireCallerIsSeedFinder();
        _burn(_account, _amount);
    }

    /* ====== Setup Functions ====== */

    function updateSeedFinderAddress(address _newAddress) external onlyOwner {
        seedFinderAddress = _newAddress;
    }

    /* ====== Internal Functions ====== */

    function _requireCallerIsSeedFinder() internal view {
        if (msg.sender != seedFinderAddress) {
            revert SeedToken__CallerIsNotSeedFinder();
        }
    }

    /* ====== Pure / View Functions ====== */

    function getSeedFinderAddress() external view returns (address) {
        return seedFinderAddress;
    }
}
