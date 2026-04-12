# ⚙️ Backend Hardhat - Infraestrutura Web3

Bem-vindo ao coração do ambiente de implantação da infraestrutura Web3. A pasta **backend** abriga todo o projeto Hardhat configurado para compilar, testar e jogar os seus contratos na rede mundial.

## 🛠 Bibliotecas e Ferramentas
- \`hardhat\`: O framework base do desenvolvimento.
- \`@openzeppelin/contracts\`: A base imutável e à prova de balas de tokens.
- \`@chainlink/contracts\`: Comunicação validada entre dados externos e os oráculos na blockchain.
- \`dotEnv\`: Gestão responsável de segredos (Chaves Privadas PK e RPC).

## 🚀 Como Executar
1. Instale todas as dependências locais:
   \`\`\`bash
   npm install
   \`\`\`
2. Configure seu ambiente: Crie um arquivo \`.env\` preenchendo a sua \`PRIVATE_KEY\` da rede Testnet.
3. Compile toda a estrutura do Solidity:
   \`\`\`bash
   npx hardhat compile
   \`\`\`
4. Conclua realizando o Deploy Automático para a rede Sepolia:
   \`\`\`bash
   npx hardhat run scripts/deploy.js --network sepolia
   \`\`\`

## 📦 Gestão de Endereços
Sempre que você usar o \`deploy.js\`, um report com quatro novos endereços de bloco da Ethereum será impresso no seu terminal. Lembre-se, esses endereços devem ser levados imediatamente para o seu Frontend no arquivo \`app.js\`!
