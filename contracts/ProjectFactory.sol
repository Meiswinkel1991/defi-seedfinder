// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/proxy/Clones.sol";

contract ProjectFactory {
    /* ====== Implementations ====== */
    address private immutable projectContractImplementation;
    address private immutable projectTokenImplementation;

    /* ====== State Variables ====== */

    address[] private deployedProjectContracts;

    /* ====== Main Functions ====== */

    constructor(
        address _projectImplementation,
        address _projectTokenImplementation
    ) {
        projectContractImplementation = _projectImplementation;
        projectTokenImplementation = _projectTokenImplementation;
    }

    /* ====== Internal Functions ====== */

    /* ====== Pure / View ====== */

    function getDeployedProjectContracts()
        external
        view
        returns (address[] memory)
    {
        return deployedProjectContracts;
    }

    function getLastDeployedProjectContract() external view returns (address) {
        return deployedProjectContracts[deployedProjectContracts.length - 1];
    }

    function getProjectImplementationContract()
        external
        view
        returns (address)
    {
        return projectContractImplementation;
    }

    function getProjectTokenImplementation() external view returns (address) {
        return projectTokenImplementation;
    }
}
