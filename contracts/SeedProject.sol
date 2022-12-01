// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract SeedProject {
    enum Status {
        pending,
        success,
        failed
    }

    /*====== State Variables ====== */

    uint256 private fundedDFIToken;

    uint256 private deadline;

    address private projectToken;

    constructor() {}
}
