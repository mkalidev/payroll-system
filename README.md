# Payroll Project

A decentralized payroll management system built with React and Reown (formerly WalletConnect) for seamless wallet integration.

## Features

- **Wallet Connection**: Connect your wallet using Reown AppKit
- **Payroll Management**: Create and manage payroll records
- **Employee Management**: Add and manage employees
- **Multi-chain Support**: Support for multiple blockchain networks (Base, Base Sepolia)
- **USDC Integration**: Pay employees using USDC tokens
- **Cross-Platform**: Works on desktop and mobile devices

## Wallet Integration

This project uses **Reown AppKit** (formerly WalletConnect) for wallet connection instead of traditional email/password authentication. Users can:

1. Connect their wallet (MetaMask, WalletConnect, Coinbase Wallet, etc.)
2. View their connected address
3. Switch between different networks
4. Disconnect their wallet when needed

## Setup

1. Install dependencies:

```bash
npm install
```

2. Get your Reown Project ID:

   - Go to [Reown Dashboard](https://dashboard.reown.com)
   - Create a new project
   - Copy your Project ID
   - Replace the project ID in `src/Provider.js` with your actual Project ID

3. Start the development server:

```bash
npm run dev
```

## Key Components

- **AppKitProvider**: Handles wallet connection using Reown AppKit
- **WagmiAdapter**: Provides wagmi integration for blockchain interactions
- **useAuth Hook**: Provides authentication state and methods
- **ProtectedRoute**: Protects routes that require wallet connection

## Authentication Flow

1. User visits the app
2. If not connected, they're redirected to the login page
3. User clicks "Connect Wallet" button
4. Reown modal opens with multiple wallet options
5. User selects and connects their preferred wallet
6. User is redirected to the main application

## Configuration

The wallet configuration is set up in `src/Provider.js`:

```javascript
// Project ID from Reown Dashboard
const projectId = "your-project-id";

// Supported networks
const networks = [baseSepolia, base];

// App metadata
const metadata = {
  name: "Gloc - Payroll",
  description: "Streamline your crypto payroll with Glöc",
  url: "https://gloc.pro",
  icons: ["https://gloc.pro/gloc-logo.svg"],
};
```

## Supported Networks

Currently configured for:

- **Base Sepolia** (Testnet)
- **Base** (Mainnet)

Additional networks can be easily added by importing them from `@reown/appkit/networks`.

## Key Dependencies

- **@reown/appkit**: Modern wallet connection SDK (formerly WalletConnect)
- **@reown/appkit-adapter-wagmi**: Wagmi adapter for Reown AppKit
- **wagmi**: React hooks for Ethereum
- **viem**: TypeScript interface for Ethereum
- **@tanstack/react-query**: Data fetching and state management
- **react-router-dom**: Client-side routing
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Beautiful & consistent icon toolkit

## Overview

The Payroll Project is a comprehensive system designed to manage employee payroll efficiently. It automates salary calculations, tax deductions, and generates detailed reports, ensuring accuracy and compliance with payroll regulations.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/oxbryte/payroll-project.git
   ```
2. Navigate to the project directory:
   ```bash
   cd payroll-project
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the application:
   ```bash
   npm run dev
   ```

## Usage

1. Access the application at `http://localhost:5178` (Vite default port).
2. Connect your wallet using the Reown AppKit interface.
3. Add employees and configure payroll settings.
4. Process payroll and generate reports.

## Technologies Used

- **Frontend**: React.js, Vite
- **Wallet Integration**: Reown AppKit (formerly WalletConnect), Wagmi
- **Blockchain**: Ethereum, Base Network
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **UI Components**: Lucide React Icons
- **Build Tool**: Vite

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please contact [oxbryte@gmail.com].
