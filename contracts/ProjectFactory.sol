// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./SeedProject.sol";
import "./tokens/SeedProjectToken.sol";

error ProjectFactory__DeadlineLowerThanTimestamp();
error ProjectFactory__AddressIsZero();

contract ProjectFactory {
    /* ====== Implementations ====== */
    address private immutable projectContractImplementation;
    address private immutable projectTokenImplementation;

    uint256 constant MAX_PROJECT_TOKEN_SUPPLY = 10000e18;

    /* ====== State Variables ====== */

    address[] private deployedProjectContracts;

    address private seedTokenAddress;

    /* ====== Events ====== */

    event ProjectCreated(
        address contractAddress,
        address tokenAddress,
        address founder,
        uint256 requestedFunding,
        uint256 deadline
    );

    /* ====== Main Functions ====== */

    constructor(
        address _projectImplementation,
        address _projectTokenImplementation,
        address _seedTokenAddress
    ) {
        projectContractImplementation = _projectImplementation;
        projectTokenImplementation = _projectTokenImplementation;

        seedTokenAddress = _seedTokenAddress;
    }

    function createNewProject(
        address _founder,
        address _fundingAddress,
        uint256 _requestedFunding,
        uint256 _deadline,
        string memory _name,
        string memory _symbol
    ) external {
        _isPossibleDeadline(_deadline);
        _isNonZeroAddress(_fundingAddress);
        _isNonZeroAddress(_founder);

        address _projectClone = Clones.clone(projectContractImplementation);

        address _tokenClone = Clones.clone(projectTokenImplementation);

        uint256 _tokenMaxSupply = _checkMaximumTotalSupply(_requestedFunding);

        SeedProjectToken(address(_tokenClone)).initialize(
            _name,
            _symbol,
            _tokenMaxSupply,
            address(_projectClone)
        );

        SeedProject(_projectClone).initialize(
            _deadline,
            _requestedFunding,
            _founder,
            _fundingAddress,
            address(_tokenClone),
            seedTokenAddress
        );

        deployedProjectContracts.push(_projectClone);

        emit ProjectCreated(
            address(_projectClone),
            address(_tokenClone),
            _founder,
            _requestedFunding,
            _deadline
        );
    }

    /* ====== Internal Functions ====== */

    function _isPossibleDeadline(uint256 _deadline) internal view {
        if (_deadline < block.timestamp) {
            revert ProjectFactory__DeadlineLowerThanTimestamp();
        }
    }

    function _isNonZeroAddress(address _to) internal pure {
        if (_to == address(0)) {
            revert ProjectFactory__AddressIsZero();
        }
    }

    function _checkMaximumTotalSupply(
        uint256 _requestAmount
    ) internal pure returns (uint256) {
        if (_requestAmount < MAX_PROJECT_TOKEN_SUPPLY) {
            return _requestAmount;
        } else {
            return MAX_PROJECT_TOKEN_SUPPLY;
        }
    }

    /* ====== Pure / View Functions ====== */

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
