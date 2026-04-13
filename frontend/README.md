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

1. **Loyalty Token (Acompanhamento Instantâneo)**: Retorna em tempo real da Blockchain o seu saldo exato acumulado da moeda (GLP).
2. **VIP Card NFT**: Transforma em arte 3D a propriedade NFT, adicionando o seu nome diretamente acima da imagem e proporcionando vantagens exclusivas na plataforma.
3. **Piscina de Staking**: Gerencia depósitos e rendimentos passivos, interligado a um oráculo global (Chainlink).
4. **Governança Comunitária**: Permite interações de auditoria e democracia para evolução do Smart Contract, suportando a exibição individual das teses em votação ativa.
5. **Loja de Resgates (E-commerce Web3)**: Uma interface interativa com produtos variados. Simulando um fluxo prático, ela realiza o débito (burn/transferência) das suas moedas GLP em troca de itens reais exclusivos para participantes do ecossistema.
