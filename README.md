# GreenMarket Web3 Loyalty Protocol

Um MVP de um Protocolo Descentralizado WEB3 construído para a rede de supermercados "GreenMarket". Este sistema integra Tokenomics (ERC-20), VIP Passes (ERC-721), Staking com Oráculo Chainlink e Governança Comunitária (DAO). 

## 📝 Visão Geral do Sistema (Modelagem)

- **O Problema**: Redes de supermercado não conseguem engajar de forma profunda o consumidor com sistemas de pontos convencionais.
- **A Solução (GreenMarket Protocol)**: 
  - Compras geram **Loyalty Tokens (SLP/GLP)** (ERC-20). 
  - Clientes regulares podem Mintar um **VIP Pass NFT** (ERC-721).
  - Pode-se colocar os Tokens em **Staking** com multiplicador de rendimentos se o preço do ETH estiver acima de 3000 USD (utilizando o Oráculo ETH/USD da **Chainlink**).
  - Os usuários também podem submeter **Propostas de Governança**, formando a DAO para votar em mudanças no protocolo.

## 🛠 Tecnologias Utilizadas
- **Linguagem**: Solidity `^0.8.20`
- **Padrões Token**: `@openzeppelin/contracts` (ERC20, ERC721, Ownable, ReentrancyGuard)
- **Oráculo**: Chainlink `AggregatorV3Interface`
- **Framework de Desenvolvimento**: Hardhat
- **Frontend Web3**: HTML5, CSS3 Glassmorphism, Vanilla JS + `ethers.js` v6
- **Testnet**: Ethereum Sepolia

## 📦 Como Instalar e Rodar

1. **Instale as dependências** do Hardhat e bibliotecas padrão:
   ```bash
   npm install
   ```

2. **Configure o arquivo `.env`** com as suas chaves da rede de Teste (Sepolia):
   - Renomeie `.env.example` para `.env`
   - Preencha `PRIVATE_KEY` com a chave primária da sua MetaMask (com ETH de teste da Sepolia).
   - Preencha `SEPOLIA_RPC_URL` (Deixe o padrão caso não tenha Alchemy/Infura, ele utilizará rpc.sepolia).

3. **Compile os contratos (Opcional)**:
   ```bash
   npx hardhat compile
   ```

4. **Realize o DEPLOY dos Contratos Inteligentes**:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

### 🖥 Utilizando o Frontend
Após o Deploy, o terminal imprimirá os 4 endereços dos contratos criados.
Abra a pasta `frontend` e edite o arquivo `app.js`. Copie e cole os endereços gerados nas variáveis do bloco `CONTRACT_ADDRESSES = { ... }`.
Em seguida, abra o `index.html` em qualquer navegador compatível com MetaMask para interagir!
