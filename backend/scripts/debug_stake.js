import hardhat from "hardhat";

async function main() {
    const CONTRACT_ADDRESSES = {
        loyaltyToken: "0x9b8693E6584494D9f71aF5b66823E0Be8f00Fad3",
        staking: "0x2340e54D5BE0E62043638A94d49cf182519C9a66",
    };

    const tokenABI = [
        "function approve(address spender, uint256 value) public returns (bool)",
        "function balanceOf(address account) public view returns (uint256)",
        "function transfer(address to, uint256 value) public returns (bool)",
        "function allowance(address owner, address spender) public view returns (uint256)"
    ];
    const stakingABI = [
        "function stake(uint256 amount) external",
        "function getLatestEthPrice() public view returns (int)",
        "function calculateReward(address user) public view returns (uint256)",
        "function stakingBalance(address user) public view returns (uint256)"
    ];

    const [signer] = await hardhat.ethers.getSigners();
    console.log("Using account:", signer.address);

    const token = new hardhat.ethers.Contract(CONTRACT_ADDRESSES.loyaltyToken, tokenABI, signer);
    const staking = new hardhat.ethers.Contract(CONTRACT_ADDRESSES.staking, stakingABI, signer);

    const balance = await token.balanceOf(signer.address);
    console.log("Token Balance:", hardhat.ethers.formatUnits(balance, 18));
    
    const sBalance = await staking.stakingBalance(signer.address);
    console.log("Staking Balance:", hardhat.ethers.formatUnits(sBalance, 18));
    
    try {
        const p = await staking.getLatestEthPrice();
        console.log("Eth Price:", p.toString());
    } catch(e) {
        console.log("Error getting Eth price:", e.message);
    }

    try {
        const r = await staking.calculateReward(signer.address);
        console.log("Pending Reward:", r.toString());
    } catch(e) {
        console.log("Error calculating reward:", e.message);
    }
    
    console.log("Attempting to estimate gas for stake...");
    const amountWei = hardhat.ethers.parseUnits("50", 18);
    // await token.approve(CONTRACT_ADDRESSES.staking, amountWei);
    // console.log("Approved.");
    try {
        const gas = await staking.stake.estimateGas(amountWei);
        console.log("Estimated Gas:", gas.toString());
    } catch (e) {
        console.error("Stake Gas Estimation Failed:", e);
    }
}

main().catch(console.error);
