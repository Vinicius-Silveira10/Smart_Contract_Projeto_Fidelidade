# 🖥️ Frontend Web3 - GreenMarket Loyalty

Este diretório contém a interface de usuário (DApp) completa projetada para interagir com os Smart Contracts do Ecossistema GreenMarket instalados na rede de testes Sepolia.

## ⚡ Tecnologias Utilizadas
- **HTML5 & CSS3** com tema exclusivo "Glassmorphism" voltado para a Web3.
- **Vanilla JavaScript** para toda a lógica da interface, mantendo o aspecto mais leve e fluido.
- **Ethers.js (v6)** importado via CDN, agindo como a ponte oficial que traduz as ações dos botões em requisições na Blockchain.

## 🚀 Como Executar Localmente
Como aplicativos Web3 e a MetaMask exigem protocolos de segurança (evitando o protocolo \`file://\`), você deve rodar a interface usando um servidor web local.

Na sua raiz ou dentro dessa pasta, execute:
\`\`\`bash
npx serve -p 3000
\`\`\`
E abra seu navegador na URL: **http://localhost:3000**.

## 🔌 Estrutura de Conexão
Tudo funciona a partir do arquivo \`app.js\`. Uma vez que você confirma na MetaMask a conexão **exclusiva na Rede Sepolia**, ele gerencia o estado global de quatro Contratos Inteligentes previamente implantados:

1. **Loyalty Token**: Usado para aprovar a transferência e alocação de pontos de recompensa.
2. **VIP Card NFT**: Responsável pela apresentação visual 3D e mintagem exclusiva, gerando benefícios cruzados com o Staking.
3. **Piscina de Staking**: Gerencia travas ativas de moedas SLP, rendendo dividendos sob métricas externas rastreadas pelo Chainlink.
4. **Governança Comunitária**: Registra e propaga votos Sim/Não baseados no poder do seu Token.
