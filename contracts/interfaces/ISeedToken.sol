// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ISeedToken is IERC20 {
    function mint(address to, uint256 amount) external;

    function burn(address _account, uint256 _amount) external;
}
