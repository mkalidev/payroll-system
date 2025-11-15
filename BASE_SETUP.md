# Base Network Configuration Guide

This guide explains how to set up and use Base mainnet and testnet in your payroll project.

## 🔗 Base Network Information

### Base Mainnet

- **Chain ID**: 8453
- **RPC URL**: https://mainnet.base.org
- **Explorer**: https://basescan.org
- **Currency**: ETH
- **Block Time**: ~2 seconds

### Base Sepolia Testnet

- **Chain ID**: 84532
- **RPC URL**: https://sepolia.base.org
- **Explorer**: https://sepolia.basescan.org
- **Currency**: ETH
- **Block Time**: ~2 seconds

## 🚀 Setup Instructions

### 1. Get API Keys

You'll need to get API keys from the following providers for better reliability:

#### Alchemy

1. Go to [Alchemy](https://www.alchemy.com/)
2. Create a new app
3. Select Base network
4. Copy your API key
5. Replace `YOUR_ALCHEMY_KEY` in `src/components/lib/wagmi.js`

#### Infura

1. Go to [Infura](https://infura.io/)
2. Create a new project
3. Add Base network endpoints
4. Copy your project ID
5. Replace `YOUR_INFURA_KEY` in `src/components/lib/wagmi.js`

#### WalletConnect

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy your Project ID
4. Replace `YOUR_WALLETCONNECT_PROJECT_ID` in `src/components/lib/wagmi.js`

### 2. Update Configuration

Edit `src/components/lib/wagmi.js` and replace the placeholder values:

```javascript
// Replace these with your actual API keys
const BASE_MAINNET_RPC_ALCHEMY =
  "https://base-mainnet.g.alchemy.com/v2/YOUR_ACTUAL_ALCHEMY_KEY";
const BASE_MAINNET_RPC_INFURA =
  "https://base-mainnet.infura.io/v3/YOUR_ACTUAL_INFURA_KEY";
const BASE_SEPOLIA_RPC_ALCHEMY =
  "https://base-sepolia.g.alchemy.com/v2/YOUR_ACTUAL_ALCHEMY_KEY";
const BASE_SEPOLIA_RPC_INFURA =
  "https://base-sepolia.infura.io/v3/YOUR_ACTUAL_INFURA_KEY";
const PROJECT_ID = "YOUR_ACTUAL_WALLETCONNECT_PROJECT_ID";
```

### 3. Update App Metadata

Update the metadata in the WalletConnect configuration:

```javascript
metadata: {
  name: "Your App Name",
  description: "Your app description",
  url: "https://your-actual-app-url.com",
  icons: ["https://your-actual-app-url.com/icon.png"],
},
```

## 🛠 Usage

### Using the Chain Switcher Component

Add the ChainSwitcher to your navbar or settings:

```jsx
import ChainSwitcher from "./components/ui/ChainSwitcher";

function Navbar() {
  return (
    <nav>
      {/* Your other navbar items */}
      <ChainSwitcher />
    </nav>
  );
}
```

### Using the useChain Hook

```jsx
import { useChain } from "./components/hooks/useChain";

function MyComponent() {
  const {
    chainId,
    currentChainName,
    isMainnet,
    isTestnet,
    switchToBaseMainnet,
    switchToBaseTestnet,
  } = useChain();

  return (
    <div>
      <p>Current Chain: {currentChainName}</p>
      <button onClick={switchToBaseMainnet}>Switch to Mainnet</button>
      <button onClick={switchToBaseTestnet}>Switch to Testnet</button>
    </div>
  );
}
```

### Using Helper Functions

```jsx
import { getRpcUrl, isBaseChain, getChainName } from "./components/lib/wagmi";

// Get RPC URL for a specific chain
const rpcUrl = getRpcUrl(8453); // Base Mainnet

// Check if a chain is Base
const isBase = isBaseChain(8453); // true

// Get chain name
const chainName = getChainName(84532); // "Base Sepolia Testnet"
```

## 🔧 Contract Deployment

### Base Mainnet

- Use real ETH for gas fees
- Deploy production contracts
- Use real USDC and other tokens

### Base Sepolia Testnet

- Get test ETH from [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
- Deploy test contracts
- Use test tokens

## 📊 Network Statistics

### Base Mainnet

- **Total Value Locked**: $1B+
- **Daily Transactions**: 1M+
- **Gas Fees**: ~$0.01-0.05 per transaction

### Base Sepolia Testnet

- **Purpose**: Testing and development
- **Gas Fees**: Free (testnet)
- **Block Time**: Same as mainnet

## 🔍 Block Explorer

- **Mainnet**: [BaseScan](https://basescan.org)
- **Testnet**: [BaseScan Sepolia](https://sepolia.basescan.org)

## 🛡 Security Considerations

1. **Always test on testnet first**
2. **Use multiple RPC providers for redundancy**
3. **Implement proper error handling for network switches**
4. **Validate transactions before sending to mainnet**

## 🐛 Troubleshooting

### Common Issues

1. **"Chain not supported" error**

   - Make sure you're using the correct chain IDs
   - Check if your wallet supports Base

2. **RPC connection issues**

   - Verify your API keys are correct
   - Check if you've hit rate limits
   - Try switching to a different RPC provider

3. **Transaction failures**
   - Ensure you have enough ETH for gas
   - Check if the contract is deployed on the correct network
   - Verify the transaction parameters

### Getting Help

- [Base Documentation](https://docs.base.org/)
- [Base Discord](https://discord.gg/buildonbase)
- [Base Twitter](https://twitter.com/BuildOnBase)
