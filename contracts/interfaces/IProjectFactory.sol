// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IProjectFactory {
    function createNewProject(
        address _founder,
        address _fundingAddress,
        uint256 _requestedFunding,
        uint256 _deadline,
        string memory _name,
        string memory _symbol
    ) external;

    function getDeployedProjectContracts()
        external
        view
        returns (address[] memory);

    function getLastDeployedProjectContract() external view returns (address);
}
