import hardhat from "hardhat";

async function main() {
    const [deployer] = await hardhat.ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);

    // 1. Deploy VIP Card NFT
    const VipCardNFT = await hardhat.ethers.getContractFactory("VipCardNFT");
    const nft = await VipCardNFT.deploy();
    await nft.waitForDeployment();
    const nftAddress = await nft.getAddress();
    console.log("VIP Card NFT deployed to:", nftAddress);

    // 2. Deploy Loyalty Token
    const LoyaltyToken = await hardhat.ethers.getContractFactory("LoyaltyToken");
    const token = await LoyaltyToken.deploy();
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log("Loyalty Token deployed to:", tokenAddress);

    // 3. Deploy Staking (requires Token & Chainlink oracle)
    // Sepolia ETH/USD Chainlink address: 0x694AA1769357215DE4FAC081bf1f309aDC325306
    const Staking = await hardhat.ethers.getContractFactory("Staking");
    const staking = await Staking.deploy(
        tokenAddress, 
        "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    );
    await staking.waitForDeployment();
    const stakingAddress = await staking.getAddress();
    console.log("Staking Contract deployed to:", stakingAddress);

    // 4. Deploy Governance (requires Token)
    const Governance = await hardhat.ethers.getContractFactory("Governance");
    const governance = await Governance.deploy(tokenAddress);
    await governance.waitForDeployment();
    const govAddress = await governance.getAddress();
    console.log("Governance DAO deployed to:", govAddress);

    console.log("-----------------------------------------");
    console.log("Deployment Complete!");
    console.log("Add these addresses to your frontend app.js:");
    console.log(`
const CONTRACT_ADDRESSES = {
    loyaltyToken: "${tokenAddress}",
    vipCardNft: "${nftAddress}",
    staking: "${stakingAddress}",
    governance: "${govAddress}"
};
    `);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
