// app.js

const connectWalletBtn = document.getElementById('connectWalletBtn');
const walletStatus = document.getElementById('walletStatus');
const walletAddressSpan = document.getElementById('walletAddress');

const mintVipBtn = document.getElementById('mintVipBtn');
const nftMintStatus = document.getElementById('nftMintStatus');

const stakeAmount = document.getElementById('stakeAmount');
const stakeBtn = document.getElementById('stakeBtn');
const stakingStatus = document.getElementById('stakingStatus');

const voteYesBtn = document.getElementById('voteYesBtn');
const voteNoBtn = document.getElementById('voteNoBtn');
const voteStatus = document.getElementById('voteStatus');

// Tradutor de erros comum
function translateError(e, defaultMsg) {
    const errorStr = (e.reason || e.message || "").toLowerCase();
    if (errorStr.includes("already voted")) return "Você já votou nesta proposta.";
    if (errorStr.includes("insufficient balance") || errorStr.includes("exceeds balance")) return "Saldo insuficiente.";
    if (errorStr.includes("transfer failed")) return "Falha na transferência. Verifique a permissão.";
    if (errorStr.includes("user rejected") || errorStr.includes("denied")) return "Transação rejeitada pelo usuário.";
    if (errorStr.includes("amount must be greater than 0")) return "A quantidade deve ser maior que zero.";
    return defaultMsg || "Transação rejeitada ou falhou na rede.";
}

const CONTRACT_ADDRESSES = {
    loyaltyToken: "0x9b8693E6584494D9f71aF5b66823E0Be8f00Fad3",
    vipCardNft: "0xE87a4F945d06D69eb1a22589cFAccDb141eA1fCD",
    staking: "0x2340e54D5BE0E62043638A94d49cf182519C9a66",
    governance: "0x4576a4B1F398C68a473F0ef382EC8B8447Df0198"
};

// Simplified ABIs needed for frontend demonstration
const nftABI = [
    "function mintVIPCard(address to, string memory uri) public"
];
const tokenABI = [
    "function approve(address spender, uint256 value) public returns (bool)",
    "function balanceOf(address account) public view returns (uint256)",
    "function transfer(address to, uint256 value) public returns (bool)"
];
const stakingABI = [
    "function stake(uint256 amount) external",
    "function stakingBalance(address user) public view returns (uint256)"
];
const daoABI = [
    "function vote(uint256 proposalId, bool support) public"
];

let provider;
let signer;
let userAddress;

async function checkConnection() {
    if (typeof window.ethers !== 'undefined' && window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                initApp(accounts[0]);
            }
        } catch (err) {
            console.error(err);
        }
    }
}

async function connectWallet() {
    if (typeof window.ethers !== 'undefined' && window.ethereum) {
        try {
            // Força a troca para a rede Sepolia (Chain ID: 11155111 ou 0xaa36a7)
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xaa36a7' }]
            });
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            initApp(accounts[0]);
        } catch (err) {
            console.error("Usuário rejeitou a requisição ou erro na troca de rede", err);
            alert("Você precisa aceitar a troca para a rede Sepolia para continuar!");
        }
    } else {
        alert('Por favor, instale a MetaMask!');
    }
}

function initApp(account) {
    userAddress = account;
    provider = new ethers.BrowserProvider(window.ethereum);
    
    // Update UI
    walletStatus.textContent = "Conectado";
    walletStatus.className = "status-connected";
    walletAddressSpan.textContent = userAddress.substring(0, 6) + "..." + userAddress.substring(38);
    connectWalletBtn.textContent = "Conectado";
    
    // Buscar Saldo de GLP
    atualizarSaldo();

    // Enable Buttons
    mintVipBtn.disabled = false;
    document.getElementById('customerName').disabled = false;
    stakeBtn.disabled = false;
    stakeAmount.disabled = false;
    voteYesBtn.disabled = false;
    voteNoBtn.disabled = false;
    const buyBtns = document.querySelectorAll('.buy-btn');
    buyBtns.forEach(btn => btn.disabled = false);

    setupInteractions();
}

async function atualizarSaldo() {
    try {
        const tokenContract = new ethers.Contract(CONTRACT_ADDRESSES.loyaltyToken, tokenABI, provider);
        const balance = await tokenContract.balanceOf(userAddress);
        const balanceStr = parseFloat(ethers.formatUnits(balance, 18)).toFixed(2) + " GLP";
        document.getElementById('tokenBalanceAmount').innerText = balanceStr;
        if (document.getElementById('availableStakingAmount')) {
            document.getElementById('availableStakingAmount').innerText = balanceStr;
        }

        // Tambem puxe o saldo do Staking
        if (CONTRACT_ADDRESSES.staking) {
            const stakContract = new ethers.Contract(CONTRACT_ADDRESSES.staking, stakingABI, provider);
            const stBalance = await stakContract.stakingBalance(userAddress);
            const stakedEl = document.getElementById('stakedBalanceAmount');
            if(stakedEl) stakedEl.innerText = parseFloat(ethers.formatUnits(stBalance, 18)).toFixed(2) + " GLP";
        }
    } catch(e) {
        console.error("Erro ao buscar saldo", e);
    }
}

async function setupInteractions() {
    signer = await provider.getSigner();

    // Atualiza overlay visual do cartao
    const nameInput = document.getElementById('customerName');
    nameInput.addEventListener('input', (e) => {
        document.getElementById('cardOverlayName').innerText = e.target.value.toUpperCase() || "SEU NOME AQUI";
    });

    // 1. Mint VIP NFT
    mintVipBtn.onclick = async () => {
        if(!CONTRACT_ADDRESSES.vipCardNft) {
            nftMintStatus.innerText = "Deploy pendente. Adicione o endereço do contrato.";
            return;
        }
        try {
            const customerName = document.getElementById('customerName').value || "Cliente VIP";
            nftMintStatus.innerText = `Gerando Cartão VIP para ${customerName}...`;
            const contract = new ethers.Contract(CONTRACT_ADDRESSES.vipCardNft, nftABI, signer);
            const tx = await contract.mintVIPCard(userAddress, "ipfs://QmVipPlaceholderUri");
            await tx.wait();
            nftMintStatus.innerText = "Sucesso! Hash: " + tx.hash.substring(0, 15) + "...";
        } catch (e) {
            console.error(e);
            nftMintStatus.innerText = "Erro: " + translateError(e, "Falha na geração do NFT");
        }
    };

    // 2. Stake Tokens
    stakeBtn.onclick = async () => {
        if(!CONTRACT_ADDRESSES.staking || !CONTRACT_ADDRESSES.loyaltyToken) {
            stakingStatus.innerText = "Deploy pendente. Adicione os endereços.";
            return;
        }
        try {
            stakingStatus.innerText = "Aguardando Aprovação...";
            const amountStr = stakeAmount.value;
            if(!amountStr || amountStr <= 0) return;
            
            const amountWei = ethers.parseUnits(amountStr, 18);
            
            const tokenContract = new ethers.Contract(CONTRACT_ADDRESSES.loyaltyToken, tokenABI, signer);
            const approveTx = await tokenContract.approve(CONTRACT_ADDRESSES.staking, amountWei);
            await approveTx.wait();

            stakingStatus.innerText = "Aguardando Staking...";
            const stakeContract = new ethers.Contract(CONTRACT_ADDRESSES.staking, stakingABI, signer);
            const stakeTx = await stakeContract.stake(amountWei);
            await stakeTx.wait();

            stakingStatus.innerText = "Sucesso! Você depositou " + amountStr + " GLP.";
            atualizarSaldo();
        } catch (e) {
            console.error(e);
            stakingStatus.innerText = "Erro: " + translateError(e, "Falha ao depositar");
        }
    };

    // 3. Resgatar Produtos Diversos (Exchange)
    const exchangeStatus = document.getElementById('exchangeStatus');
    const buyBtns = document.querySelectorAll('.buy-btn');
    
    buyBtns.forEach(btn => {
        btn.onclick = async () => {
            const costStr = btn.getAttribute('data-cost');
            const itemName = btn.getAttribute('data-name');
            try {
                exchangeStatus.innerText = `Aprovando resgate de ${itemName}...`;
                const amountWei = ethers.parseUnits(costStr, 18);
                
                // Simula o resgate transferindo para o endereço morto
                const tokenContract = new ethers.Contract(CONTRACT_ADDRESSES.loyaltyToken, tokenABI, signer);
                const burnAddress = "0x000000000000000000000000000000000000dEaD";
                const tx = await tokenContract.transfer(burnAddress, amountWei);
                
                exchangeStatus.innerText = "Processando pagamento...";
                await tx.wait();

                exchangeStatus.innerText = `🎉 Sucesso! Você resgatou: ${itemName} por ${costStr} GLP.`;
                atualizarSaldo();
            } catch (e) {
                console.error(e);
                exchangeStatus.innerText = "Erro: " + translateError(e, "Falha no resgate");
            }
        };
    });

    // 4. DAO Vote Handler
    const handleVote = async (support) => {
        if(!CONTRACT_ADDRESSES.governance) {
            voteStatus.innerText = "Deploy pendente. Adicione o endereço do contrato.";
            return;
        }
        try {
            voteStatus.innerText = "Computando voto...";
            const daoContract = new ethers.Contract(CONTRACT_ADDRESSES.governance, daoABI, signer);
            // hardcoded proposalId = 0 for demonstration
            const tx = await daoContract.vote(0, support); 
            await tx.wait();
            voteStatus.innerText = `Voto ${support?"SIM":"NÃO"} registrado com sucesso!`;
        } catch (e) {
            console.error(e);
            voteStatus.innerText = "Erro: " + translateError(e, "Falha ao registrar voto");
        }
    };

    voteYesBtn.onclick = () => handleVote(true);
    voteNoBtn.onclick = () => handleVote(false);
}

connectWalletBtn.addEventListener('click', connectWallet);
window.onload = checkConnection;
