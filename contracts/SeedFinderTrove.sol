// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/ISeedToken.sol";

error SeedFinderTrove__NotEnoughAllowance();

contract SeedFinderTrove {
    /* === State Variables ====== */

    ISeedToken private seedToken;
    IERC20 private DFIToken;

    uint256 private lockedDFIToken;

    /* ====== Events ====== */

    event TokenSwap(address _from, address _to, uint256 _amount);

    /* ====== Main Functions ====== */

    constructor(address _DFITokenAddress, address _dSeedTokenAddress) {
        DFIToken = IERC20(_DFITokenAddress);
        seedToken = ISeedToken(_dSeedTokenAddress);
    }

    function swapDFITokenToSeedToken(uint256 _amount) external {
        uint256 _allowance = DFIToken.allowance(msg.sender, address(this));

        if (_allowance < _amount) {
            revert SeedFinderTrove__NotEnoughAllowance();
        }

        require(DFIToken.transferFrom(msg.sender, address(this), _amount));

        seedToken.mint(msg.sender, _amount);

        lockedDFIToken += _amount;

        emit TokenSwap(address(DFIToken), address(seedToken), _amount);
    }

    function swapSeedTokenToDFIToken(uint256 _amount) external {
        seedToken.burn(msg.sender, _amount);

        require(DFIToken.transfer(msg.sender, _amount));

        lockedDFIToken -= _amount;

        emit TokenSwap(address(seedToken), address(DFIToken), _amount);
    }

    /* ====== Internal Functions ====== */

    /* ====== Pure / View Functions ======*/

    function getDFITokenAddress() external view returns (address) {
        return address(DFIToken);
    }

    function getDSeedTokenAddress() external view returns (address) {
        return address(seedToken);
    }

    function getLockedDFITokens() external view returns (uint256) {
        return lockedDFIToken;
    }
}
