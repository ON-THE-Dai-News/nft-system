# NFT System

Automated NFT creation system that transforms AI-generated news art into NFTs on Mode Network (Ethereum L2).

## Overview
- **Project Duration:** 2 weeks (Phase 1)
- **Primary Goal:** Automated NFT creation system for AI-generated news art
- **Platform:** Mode Network (Ethereum L2)

## Technical Stack

### Frontend/Integration (JavaScript)
- Express.js API
- React
- Mode Network SDK (GOAT)
- Google APIs (Drive, Sheets)
- Asset management

### Backend (Python)
- Web3.py
- Mode Network tools
- Smart contract deployment
- NFT minting service

### Infrastructure
- Mode Network
- IPFS/Arweave
- Google Cloud (existing)
- Git/GitHub

## Project Structure
```
nft-system/
├── src/              # Frontend/Integration layer
│   ├── components/   # React components
│   ├── services/     # API services
│   ├── contexts/     # React contexts
│   └── utils/        # Utility functions
├── server/           # Express.js backend
├── contracts/        # Smart contracts
└── docs/            # Documentation
```

## Setup Instructions

### Development Environment
1. Clone the repository
```bash
git clone https://github.com/your-org/nft-system.git
cd nft-system
```

2. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

3. Backend Setup
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Unix
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Start backend server
python server/index.py
```

4. Mode Network Setup
- Configure Mode Network testnet in your Web3 wallet
- Get testnet tokens from Mode Network faucet
- Set up environment variables (see .env.example)

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