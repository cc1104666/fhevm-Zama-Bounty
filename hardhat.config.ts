import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@fhevm/hardhat-plugin";
import "hardhat-deploy";

// Load environment variables
const MNEMONIC = process.env.MNEMONIC || "test test test test test test test test test test test junk";
const INFURA_API_KEY = process.env.INFURA_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  
  networks: {
    hardhat: {
      chainId: 31337,
      accounts: {
        mnemonic: MNEMONIC,
        count: 10,
      },
    },
    
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      accounts: {
        mnemonic: MNEMONIC,
      },
    },
    
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      chainId: 11155111,
      accounts: {
        mnemonic: MNEMONIC,
      },
    },
    
    // Zama Testnet configuration
    zamaTestnet: {
      url: "https://devnet.zama.ai",
      chainId: 8009,
      accounts: {
        mnemonic: MNEMONIC,
      },
    },
  },
  
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user1: {
      default: 1,
    },
    user2: {
      default: 2,
    },
  },
  
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    deploy: "./deploy",
  },
  
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
};

export default config;
