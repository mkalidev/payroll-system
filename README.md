# Gloc Payroll

A decentralized payroll management system built with React and blockchain technology. Streamline your crypto payroll with automated salary calculations, tax deductions, and comprehensive reporting.

## 🚀 Features

- **🔐 Wallet Integration**: Connect using Reown AppKit (formerly WalletConnect) - supports MetaMask, WalletConnect, Coinbase Wallet, and more
- **💰 Payroll Management**: Create, manage, and process payroll records with ease
- **👥 Employee Management**: Add, update, and manage employee information with bulk CSV import
- **🌐 Multi-chain Support**: Built for Base and Base Sepolia networks (easily extensible)
- **💵 USDC Integration**: Pay employees directly using USDC tokens on-chain
- **📊 Analytics & Reports**: Comprehensive analytics dashboard with payment tracking and employee insights
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🎨 Modern UI**: Beautiful, intuitive interface with purple theme

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- A **Reown Project ID** ([Get one here](https://dashboard.reown.com))

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/oxbryte/payroll-project.git
   cd payroll-project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Reown Project ID:**
   - Go to [Reown Dashboard](https://dashboard.reown.com)
   - Create a new project
   - Copy your Project ID
   - Open `src/Provider.js` and replace `"your-project-id"` with your actual Project ID:
     ```javascript
     const projectId = "your-actual-project-id";
     ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Open your browser and navigate to `http://localhost:5178` (or the port shown in your terminal)

## ⚙️ Configuration

### Wallet Configuration

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

### Supported Networks

Currently configured for:
- **Base Sepolia** (Testnet) - Recommended for testing
- **Base** (Mainnet) - Production use

To add additional networks, import them from `@reown/appkit/networks` and add to the `networks` array.

## 📖 Usage

### Getting Started

1. **Connect Your Wallet:**
   - Click "Connect Wallet" on the login page
   - Select your preferred wallet from the Reown modal
   - Approve the connection request

2. **Create a Workspace:**
   - Navigate to the Workspace section
   - Click "Create New Workspace"
   - Fill in workspace details (name, email, description, etc.)

3. **Add Employees:**
   - Go to your workspace
   - Click "Add New Employee" or use bulk CSV import
   - Fill in employee details (name, email, role, salary, etc.)

4. **Process Payroll:**
   - Navigate to the Payroll section
   - Click "New Payroll"
   - Select employees and configure payroll settings
   - Approve USDC spending (if needed)
   - Distribute payroll on-chain

### Authentication Flow

1. User visits the app
2. If not connected, they're redirected to the login page
3. User clicks "Connect Wallet" button
4. Reown modal opens with multiple wallet options
5. User selects and connects their preferred wallet
6. User is authenticated and redirected to the main application

## 🏗️ Project Structure

```
src/
├── components/
│   ├── features/          # Feature-specific components
│   │   ├── workspace/     # Workspace management
│   │   ├── Analytics/     # Analytics and charts
│   │   └── settings/      # Settings pages
│   ├── layouts/           # Layout components
│   ├── ui/                # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   └── services/          # API services
├── pages/                 # Page components
├── Provider.jsx           # AppKit provider configuration
└── main.jsx               # Application entry point
```

### Key Components

- **AppKitProvider**: Handles wallet connection using Reown AppKit
- **WagmiAdapter**: Provides wagmi integration for blockchain interactions
- **useAuth Hook**: Provides authentication state and methods
- **ProtectedRoute**: Protects routes that require wallet connection
- **ConnectButtonThirdweb**: Wallet connection and payroll distribution component

## 🛠️ Technologies Used

### Core
- **React.js** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety (via JSDoc)

### Blockchain & Wallet
- **@reown/appkit** - Modern wallet connection SDK (formerly WalletConnect)
- **@reown/appkit-adapter-wagmi** - Wagmi adapter for Reown AppKit
- **wagmi** - React hooks for Ethereum
- **viem** - TypeScript interface for Ethereum
- **thirdweb/react** - Additional wallet integration

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **lucide-react** - Icon toolkit

### State Management & Data
- **@tanstack/react-query** - Data fetching and state management
- **react-hook-form** - Form handling

### Routing
- **react-router-dom** - Client-side routing

## 📦 Key Dependencies

```json
{
  "@reown/appkit": "^1.x.x",
  "@reown/appkit-adapter-wagmi": "^1.x.x",
  "wagmi": "^2.x.x",
  "viem": "^2.x.x",
  "@tanstack/react-query": "^5.x.x",
  "react-router-dom": "^6.x.x",
  "tailwindcss": "^4.x.x"
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and test thoroughly
4. **Commit your changes:**
   ```bash
   git commit -m "feat: add your feature description"
   ```
5. **Push to your branch:**
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open a Pull Request** with a clear description of your changes

### Commit Convention

We follow conventional commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `style:` - Code style changes (formatting, colors, etc.)
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📧 Contact

For questions, support, or collaboration opportunities:

- **Email**: [oxbryte@gmail.com](mailto:oxbryte@gmail.com)
- **Website**: [https://gloc.pro](https://gloc.pro)

## 🙏 Acknowledgments

- Built with [Reown AppKit](https://reown.com) for seamless wallet integration
- Powered by [Base Network](https://base.org) for fast and low-cost transactions

---

**Made with ❤️ by the Gloc team**
