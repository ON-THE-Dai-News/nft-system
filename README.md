# OTDNews NFT System

An automated AI-powered NFT creation system that transforms breaking news headlines into NFTs on the Mode Network (Ethereum L2).

## Overview

- **Project Objective:** Fully automated NFT generation and minting process for AI-generated news-based art
- **Blockchain:** Mode Network (Ethereum L2)
- **Storage:** IPFS (via Pinata SDK)
- **AI Agents:** Automated metadata and image prompt generation
- **Frontend:** React & Next.js
- **Backend:** Node.js (Express)

## System Architecture

### 1. AI Agents (Metadata & Art)

- **News Metadata Generator:** Generates structured metadata from breaking news
- **Image Prompt Generator:** Converts news metadata into AI-generated art prompts
- **AI Art Interface:** Generates an AI-enhanced image based on the prompt

### 2. Integration Layer (Backend & Processing)

- **Node.js (Express API)** for managing metadata & NFT automation
- **Pinata SDK** to upload metadata & images to IPFS
- **Mode Network SDK** for blockchain interaction

### 3. Storage Layer

- **JSON Metadata Storage:** Local JSON files (migrating to AWS S3)
- **Decentralized Storage:** IPFS via Pinata SDK

### 4. NFT System (Blockchain & Minting)

- Pre-processed NFT metadata stored on IPFS
- User triggers minting via frontend UI
- Mode Smart Contracts handle NFT minting & blockchain interaction

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/nft-system.git
cd nft-system
cd js-integration
```

### 2. Install Dependencies
```bash
npm install
npm run dev  # Start Next.js development server
```

### 3. Configure Environment Variables

1. Copy the example env file:
```bash
cp .env.example .env
```
2. Set up API keys for Pinata, Mode Network, and any other required services

## Workflow & Automation

### Automated NFT Processing (Runs Daily at 12:30 AM EST)

1. Fetch news metadata from JSON storage
2. Upload image & metadata to IPFS (Pinata SDK)
3. Store pre-processed NFT metadata for minting

### User Minting Process (After 1 AM EST)

1. User connects wallet to the Next.js frontend
2. Selects an available NFT and clicks "Mint Random NFT"
3. Smart contract finalizes minting on Mode Network

## Development Guidelines

### Branch Naming
- `feature/[feature-name]` → New features
- `fix/[bug-name]` → Bug fixes
- `update/[update-description]` → General updates

### Commit Messages
- `feat:` → New feature
- `fix:` → Bug fix
- `docs:` → Documentation update
- `refactor:` → Code restructuring

### Pull Request Process
1. Create a new branch from `main`
2. Update documentation if necessary
3. Request a review before merging
4. Squash & merge after approval

## Next Steps & Future Enhancements

### Phase 1 (MVP Features)
- ✅ Fully automated NFT metadata processing
- ✅ IPFS storage integration
- ✅ Mode Smart Contract deployment
- ✅ Minting interface for users

### Phase 2 (Upcoming Features)
- 🛠️ NFT Marketplace Integration
- 🔄 Advanced Trading & Transfers
- 📈 Enhanced Metadata & AI Insights
- 🌐 Multi-platform NFT Support

## Contributors

- **Mario:** Fullstack Engineer
- **Daniel** Product Manager
- **Bilal** Backend Engineer