# 📝 Smart Contracts - Arquitetura Interna

Este diretório comporta os códigos-fonte nativos em linguagem Solidity (\`v0.8.24\`) que formam o pilar lógico e blindado do projeto institucional. Juntos, eles formam um ecossistema econômico de recompensas complexo.

## 1. LoyaltyToken.sol (ERC-20)
O coração da liquidez. Extende o molde de `ERC20` fornecido pela OpenZeppelin. O token SLP, *Supermarket Loyalty Points*, é distribuído sob critérios matemáticos de recompensa e pode ser congelado livremente.

## 2. VipCardNFT.sol (ERC-721)
O mecanismo de Identidade Sustentável. Esse NFT não guarda apenas um valor estético. A lógica cruza o VIP Card com um `ERC721URIStorage`, abrindo a possibilidade da empresa rastrear os metadados fixos de seus sócios e emitir descontos físicos cruzados.

## 3. Staking.sol (Oráculos + Reentrância)
O motor financeiro descentralizado. Construído com `ReentrancyGuard` e conectado com Oráculos da **Chainlink Protocol**. Ele observa, de forma descentralizada, o cenário do mundo real (preço do ETH/USD) ou métricas climáticas/mercado e ajusta os lucros e rendimentos diários do usuário.

## 4. Governance.sol (DAO Simplificada)
O protocolo de regras mutáveis e democráticas. Funciona como uma praça de votação onde o usuário pode ler todas as propostas administrativas recentes (como a de alterar valores do Supermercado) e votar **sim ou não**. Os votos são armazenados nativamente.
