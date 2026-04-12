// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract Staking is ReentrancyGuard {
    IERC20 public stakingToken;
    AggregatorV3Interface internal priceFeed;

    mapping(address => uint256) public stakingBalance;
    mapping(address => uint256) public startTime;

    uint256 public constant REWARD_RATE = 100; // base reward rate
    
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount, uint256 reward);

    /**
     * @dev Constructor
     * @param _stakingToken Address of the ERC20 token to stake
     * @param _priceFeed Address of the Chainlink ETH/USD aggregator (Sepolia: 0x694AA176...)
     */
    constructor(address _stakingToken, address _priceFeed) {
        stakingToken = IERC20(_stakingToken);
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(stakingToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        if (stakingBalance[msg.sender] > 0) {
            // Claim pending rewards if already staking
            uint256 reward = calculateReward(msg.sender);
            if (reward > 0) {
                require(stakingToken.transfer(msg.sender, reward), "Reward transfer failed");
            }
        }

        stakingBalance[msg.sender] += amount;
        startTime[msg.sender] = block.timestamp;
        
        emit Staked(msg.sender, amount);
    }

    function withdraw() external nonReentrant {
        uint256 amount = stakingBalance[msg.sender];
        require(amount > 0, "No staked amount");

        uint256 reward = calculateReward(msg.sender);
        
        stakingBalance[msg.sender] = 0;
        startTime[msg.sender] = 0;

        require(stakingToken.transfer(msg.sender, amount + reward), "Transfer failed");

        emit Withdrawn(msg.sender, amount, reward);
    }

    function getLatestEthPrice() public view returns (int) {
        (
            /* uint80 roundID */,
            int price,
            /* uint startedAt */,
            /* uint timeStamp */,
            /* uint80 answeredInRound */
        ) = priceFeed.latestRoundData();
        return price;
    }

    /**
     * @dev Calculates the reward based on staking time, base rate, and Oracle price multiplier
     */
    function calculateReward(address user) public view returns (uint256) {
        if (stakingBalance[user] == 0) return 0;
        
        uint256 stakingDuration = block.timestamp - startTime[user];
        uint256 baseReward = (stakingBalance[user] * REWARD_RATE * stakingDuration) / 10000;
        
        // Use oracle: if ETH price is high, give bonus (just an example of consumption)
        int ethPrice = getLatestEthPrice(); 
        uint256 multiplier = 1;
        if (ethPrice > 3000 * 10**8) { // if ETH > 3000 USD
            multiplier = 2; // 2x rewards
        }

        return baseReward * multiplier;
    }
}
