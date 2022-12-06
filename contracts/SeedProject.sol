// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error SeedProject__FundingNotFinished();
error SeedProject__FundingDontSucceed();
error SeedProject__FundingDontFailed();

contract SeedProject {
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

    constructor(
        uint256 _deadline,
        uint256 _requestedFunds,
        address _founder,
        address _fundingAddress
    ) {
        projectStatus = Status.pending;

        deadline = _deadline;
        requestedFunds = _requestedFunds;
    }

    function finishProject() external {}

    /* ====== Internal Functions ======*/

    function _setStatus(Status _newStatus) internal {}

    function _transferFundsToFundingAddress() internal {
        uint256 _balance = IERC20(projectToken).balanceOf(address(this));

        IERC20(projectToken).transfer(fundingAddress, _balance);
    }

    /* ====== Pure / View Functions ====== */
    function isFundingFinished() public view returns (bool) {
        return block.timestamp > deadline ? true : false;
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
