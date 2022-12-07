// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error SeedProject__FundingNotFinished();
error SeedProject__FundingDontSucceed();
error SeedProject__FundingDontFailed();

contract SeedProject is Initializable {
    using SafeMath for uint256;

    enum Status {
        pending,
        success,
        failed
    }

    /*====== State Variables ====== */

    uint256 private requestedFunds;

    uint256 private deadline;

    address private projectToken;

    address private founder;

    address private fundingAddress;

    Status private projectStatus;

    /* ====== Events ====== */

    event FundingsTransfered(address fundingAddress, uint256 tokenAmount);
    event ProjectStatusChanged(Status newStatus);

    /* ====== Modifier ====== */

    modifier isFinished() {
        if (!isFundingFinished()) {
            revert SeedProject__FundingNotFinished();
        }
        _;
    }

    modifier isSucceed() {
        if (projectStatus != Status.success) {
            revert SeedProject__FundingDontSucceed();
        }
        _;
    }

    modifier isFailed() {
        if (projectStatus != Status.failed) {
            revert SeedProject__FundingDontFailed();
        }
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        uint256 _deadline,
        uint256 _requestedFunds,
        address _founder,
        address _fundingAddress,
        address _tokenAddress
    ) public initializer {
        projectStatus = Status.pending;

        deadline = _deadline;
        requestedFunds = _requestedFunds;
        founder = _founder;
        fundingAddress = _fundingAddress;
        projectToken = _tokenAddress;
    }

    function finishProject() external isFinished {
        uint256 _fundingAmount = getFundedTokenAmount();

        if (_fundingAmount < requestedFunds) {
            require(_transferFundsToFundingAddress(_fundingAmount));

            _setStatus(Status.success);
        } else {
            _setStatus(Status.failed);
        }
    }

    function retrieveFunds() external isFinished isFailed {}

    /* ====== Internal Functions ======*/

    function _setStatus(Status _newStatus) internal {
        projectStatus = _newStatus;
    }

    function _transferFundsToFundingAddress(
        uint256 _amount
    ) internal returns (bool) {
        return IERC20(projectToken).transfer(fundingAddress, _amount);
    }

    /* ====== Pure / View Functions ====== */
    function isFundingFinished() public view returns (bool) {
        return block.timestamp > deadline ? true : false;
    }

    function getFundedTokenAmount() public view returns (uint256) {
        return IERC20(projectToken).balanceOf(address(this));
    }

    function getRequestedFunds() external view returns (uint256) {
        return requestedFunds;
    }

    function getProjectTokenAddress() external view returns (address) {
        return projectToken;
    }

    function getDeadline() external view returns (uint256) {
        return deadline;
    }

    function getFounder() external view returns (address) {
        return founder;
    }

    function getFundingAddress() external view returns (address) {
        return fundingAddress;
    }

    function getRemainingFundingTime() external view returns (uint256) {
        return block.timestamp > deadline ? 0 : deadline.sub(block.timestamp);
    }
}
