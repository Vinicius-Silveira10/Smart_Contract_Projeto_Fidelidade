import hardhat from "hardhat";

async function main() {
    const CONTRACT_ADDRESSES = {
        loyaltyToken: "0x9b8693E6584494D9f71aF5b66823E0Be8f00Fad3",
        staking: "0x2340e54D5BE0E62043638A94d49cf182519C9a66",
    };

    const tokenABI = [
        "function transfer(address to, uint256 value) public returns (bool)",
    ];

    const [signer] = await hardhat.ethers.getSigners();
    console.log("Using account:", signer.address);

    const token = new hardhat.ethers.Contract(CONTRACT_ADDRESSES.loyaltyToken, tokenABI, signer);

    console.log("Transferindo 500,000 GLP para a pool do Staking...");
    const amountWei = hardhat.ethers.parseUnits("500000", 18);
    const tx = await token.transfer(CONTRACT_ADDRESSES.staking, amountWei);
    await tx.wait();
    
    console.log("Staking Contract funded successfully!");
}

main().catch(console.error);
