// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract SeedProjectToken is
    Initializable,
    ERC20Upgradeable,
    ERC20PermitUpgradeable
{
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply,
        address _projectAddress
    ) public initializer {
        __ERC20_init(_name, _symbol);
        __ERC20Permit_init(_name);

        _mintTokensForProject(_projectAddress, _totalSupply);
    }

    function _mintTokensForProject(address _to, uint256 _amount) internal {
        _mint(_to, _amount);
    }
}
