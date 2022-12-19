// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IProjectFactory.sol";

contract SeedFinderManager is Ownable {
    /* ====== State Variables ====== */

    mapping(address => uint256) private withdrawAllowances;

    address private projectFactory;

    constructor() {}

    /* ====== Main Functions ====== */

    function createNewProject() external {}

    function fundProject(address _project, uint256 _amount) external {}

    function finishProject(address _project) external {}

    function retrieveFundsFromProjects(address[] memory _projects) external {}

    function allowWithdrawFromProject(
        address _project,
        uint256 _amount
    ) external onlyOwner {}

    function withdrawFundsFromProject(
        address _project,
        uint256 _amount
    ) external {}

    /* ====== Internal Functions ====== */

    function _isFounderOfProject() internal view {}

    function _isAllowedToWithdrawFunds() internal view {}

    /* ====== Pure / View Functions ====== */

    function getWithdrawAllowance(
        address _project
    ) public view returns (uint256) {
        return withdrawAllowances[_project];
    }

    function getDeployedProjectContracts()
        public
        view
        returns (address[] memory)
    {
        return IProjectFactory(projectFactory).getDeployedProjectContracts();
    }

    function getProjectFactoryAddress() external view returns (address) {
        return projectFactory;
    }
}
