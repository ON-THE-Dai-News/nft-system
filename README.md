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
git clone https://github.com/ON-THE-Dai-News/nft-system.git
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

### Git Workflow
1. Branch Naming:
   - `feature/[feature-name]`
   - `fix/[bug-name]`
   - `update/[update-description]`

2. Commit Messages:
   - `feat:` (new feature)
   - `fix:` (bug fix)
   - `docs:` (documentation)
   - `style:` (formatting)
   - `refactor:` (code restructure)

3. Pull Request Process:
   - Create branch from main
   - Update documentation
   - Request review
   - Squash and merge

## Team
- **Mario:** Fullstack Engineer (System Architecture & Integration)
- **Bilal:** Backend Engineer (NFT Creation System)
- **Daniel:** Product Manager (Documentation & Requirements)

## MVP Features (Phase 1)
- Automated NFT minting
- Basic metadata handling
- IPFS/Arweave storage
- Direct minting interface
- Error handling and logging

## Testing
- Smart contract testing
- Minting process verification
- Integration testing
- Error scenario handling

## Communication
- Daily Telegram updates
- Technical discussion channel
- Documentation sharing
- Progress tracking

## Next Steps
1. Mode Network environment setup
2. Smart contract development
3. Minting service creation
4. Integration testing

## Future Plans (Phase 2)
- Marketplace integration
- Advanced trading features
- Enhanced metadata
- Additional marketplace support
