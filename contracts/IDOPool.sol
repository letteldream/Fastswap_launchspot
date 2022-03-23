//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract IDOPool is Ownable {
    ERC20 public fastToken = ERC20(0xB089ebD0670365C26a6eC7B37D81Ad8159d9ce23);
    ERC20 public dukeToken = ERC20(0xa815e74e00c192E3D9261E486440A1f1fF00A4Ef);
    ERC20 public idoToken;
    ERC20 public usdt = ERC20(0x2d0B833E218AE62B314D06BEFac900e477cB2A94);

    uint256 public rate;
    uint256 public hardCap;
    uint256 public softCap;

    uint256 public FAST_TIER1_AMOUNT = 50000000000000000000000;
    uint256 public DUKE_TIER1_AMOUNT = 500000000000000000000000000;
    uint256 public FAST_TIER2_AMOUNT = 100000000000000000000000;
    uint256 public DUKE_TIER2_AMOUNT = 1000000000000000000000000000;
    uint256 public FAST_TIER3_AMOUNT = 300000000000000000000000;
    uint256 public DUKE_TIER3_AMOUNT = 3000000000000000000000000000;
    uint256 public FAST_TIER4_AMOUNT = 600000000000000000000000;
    uint256 public DUKE_TIER4_AMOUNT = 6000000000000000000000000000;

    uint256[5] public allocPercents = [10, 10, 15, 25, 40];
    uint256[5] public tierContributions;
    mapping(address => uint256) public contributions;

    mapping(address => uint256) public userTier;

    mapping(address => uint256) public fastStakedAmount;
    uint256 public fastTotalStakedAmount;
    uint256 public fastTotalStakers;
    mapping(address => uint256) public dukeStakedAmount;
    uint256 public dukeTotalStakedAmount;
    uint256 public dukeTotalStakers;

    uint256 public totalContributions;

    uint256 public startTime;
    uint256 public endTime;

    uint256 public SAFE_STAKE_PERIOD = 7 days;
    uint256 public SAFE_UNSTAKE_PERIOD = 5 days;

    mapping(address => bool) public whitelist;

    constructor(
        uint256 _startTime,
        uint256 _endTime,
        address _idoToken,
        uint256 _rate,
        uint256 _softCap,
        uint256 _hardCap
    ) {
        // console.log("Deploying a Greeter with greeting:", _startTime, _endTime);
        require(_endTime > _startTime && _endTime > block.timestamp, 'wrong endtime');
        require(_rate > 0, 'rate is 0');
        require(_idoToken != address(0), 'token is the zero address');
        require(_softCap < _hardCap, 'Softcap must be lower than Hardcap');
        startTime = _startTime;
        endTime = _endTime;
        idoToken = ERC20(_idoToken);
        rate = _rate;
        softCap = _softCap;
        hardCap = _hardCap;
    }

    function addWhitelists(address[] memory _whitelist) external onlyOwner {
        for (uint256 i = 0; i < _whitelist.length; i++) {
            whitelist[_whitelist[i]] = true;
        }
    }

    receive() external payable {}

    function _balanceOf() internal view returns (uint256) {
        return usdt.balanceOf(address(this));
    }

    function stakeFast(uint256 _amount) external isStakeActive {
        fastToken.transferFrom(msg.sender, address(this), _amount);
        fastTotalStakedAmount += _amount;
        if (fastStakedAmount[msg.sender] == 0) fastTotalStakers++;
        fastStakedAmount[msg.sender] += _amount;
        updateTierWithFast();
    }

    function unStakeFast(uint256 _amount) external isUnStakeActive {
        require(fastStakedAmount[msg.sender] >= _amount, 'Insufficient token balance');
        fastTotalStakedAmount -= _amount;
        fastStakedAmount[msg.sender] -= _amount;
        if (fastStakedAmount[msg.sender] == 0) fastTotalStakers--;
        fastToken.transfer(msg.sender, _amount);
        updateTierWithFast();
    }

    function stakeDuke(uint256 _amount) external isStakeActive {
        dukeToken.transferFrom(msg.sender, address(this), _amount);
        dukeTotalStakedAmount += _amount;
        if (dukeStakedAmount[msg.sender] == 0) dukeTotalStakers++;
        dukeStakedAmount[msg.sender] += _amount;
        updateTierWithDuke();
    }

    function unStakeDuke(uint256 _amount) external isUnStakeActive {
        require(dukeStakedAmount[msg.sender] >= _amount, 'Insufficient token balance');
        dukeTotalStakedAmount -= _amount;
        dukeStakedAmount[msg.sender] -= _amount;
        if (dukeStakedAmount[msg.sender] == 0) dukeTotalStakers--;
        dukeToken.transfer(msg.sender, _amount);
        updateTierWithDuke();
    }

    function purchase(uint256 _amount) external icoActive {
        address account = msg.sender;
        if (userTier[account] == 0) {
            require(whitelist[account] == true, 'not whitelisted');
        }
        require(_amount != 0, 'Presale: weiAmount is 0');
        require(_amount + _balanceOf() <= hardCap, 'Hard Cap reached');
        uint256 tier = userTier[account];
        uint256 allocLimit = (hardCap * allocPercents[tier]) / 100;
        require(_amount + tierContributions[tier] <= allocLimit, 'Cannot exceed tier limit');

        usdt.transferFrom(account, address(this), _amount);
        totalContributions += _amount;
        contributions[account] = contributions[account] + _amount;
        tierContributions[tier] += _amount;
    }

    function _getTokenAmount(uint256 amount) internal view returns (uint256) {
        return (amount / 10**(usdt.decimals())) * rate * (idoToken.decimals());
    }

    function updateTierWithFast() internal {
        uint256 stakedAmount = fastStakedAmount[msg.sender];
        if (stakedAmount >= FAST_TIER4_AMOUNT) {
            userTier[msg.sender] = 4;
        } else if (stakedAmount >= FAST_TIER3_AMOUNT) {
            userTier[msg.sender] = 3;
        } else if (stakedAmount >= FAST_TIER2_AMOUNT) {
            userTier[msg.sender] = 2;
        } else if (stakedAmount >= FAST_TIER1_AMOUNT) {
            userTier[msg.sender] = 1;
        } else {
            userTier[msg.sender] = 0;
        }
    }

    function updateTierWithDuke() internal {
        uint256 stakedAmount = dukeStakedAmount[msg.sender];
        if (stakedAmount >= DUKE_TIER4_AMOUNT) {
            userTier[msg.sender] = 4;
        } else if (stakedAmount >= DUKE_TIER3_AMOUNT) {
            userTier[msg.sender] = 3;
        } else if (stakedAmount >= DUKE_TIER2_AMOUNT) {
            userTier[msg.sender] = 2;
        } else if (stakedAmount >= DUKE_TIER1_AMOUNT) {
            userTier[msg.sender] = 1;
        } else {
            userTier[msg.sender] = 0;
        }
    }

    function claimTokens() external icoNotActive {
        uint256 tokensAmt = _getTokenAmount(contributions[msg.sender]);
        contributions[msg.sender] = 0;
        idoToken.transfer(msg.sender, tokensAmt);
    }

    function setTierFastLimit(uint256[] memory _limits) external onlyOwner {
        FAST_TIER1_AMOUNT = _limits[0];
        FAST_TIER2_AMOUNT = _limits[1];
        FAST_TIER3_AMOUNT = _limits[2];
        FAST_TIER4_AMOUNT = _limits[3];
    }

    function setTierDukeLimit(uint256[] memory _limits) external onlyOwner {
        DUKE_TIER1_AMOUNT = _limits[0];
        DUKE_TIER2_AMOUNT = _limits[1];
        DUKE_TIER3_AMOUNT = _limits[2];
        DUKE_TIER4_AMOUNT = _limits[3];
    }

    function withdraw() external onlyOwner icoNotActive {
        payable(msg.sender).transfer(address(this).balance);
    }

    function withdrawToken(ERC20 _token, uint256 amount) external onlyOwner icoNotActive {
        _token.transfer(msg.sender, amount);
    }

    function setRate(uint256 newRate) external onlyOwner icoNotActive {
        rate = newRate;
    }

    function setHardCap(uint256 value) external onlyOwner {
        hardCap = value;
    }

    function setSoftCap(uint256 value) external onlyOwner {
        softCap = value;
    }

    modifier icoActive() {
        require(block.timestamp >= startTime && block.timestamp <= endTime, 'Presale must be active');
        require(_balanceOf() < hardCap, 'Contribution Amount need to be smaller than HardCap');
        _;
    }

    modifier icoNotActive() {
        require(
            _balanceOf() >= hardCap || (block.timestamp > endTime && _balanceOf() >= softCap),
            'Presale should not be active'
        );
        _;
    }

    modifier isStakeActive() {
        require(block.timestamp <= startTime - SAFE_STAKE_PERIOD, 'Not Staking Period');
        _;
    }

    modifier isUnStakeActive() {
        require(block.timestamp >= endTime + SAFE_UNSTAKE_PERIOD, 'Not Unstaking Period');
        _;
    }
}
