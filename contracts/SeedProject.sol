// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract SeedProject is Initializable {
    enum Status {
        pending,
        success,
        failed
    }

    /*====== State Variables ====== */

    uint256 private fundedDFIToken;

    uint256 private deadline;

    address private projectToken;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {}
}
