// BASE-DOT-FUN App.js - Multi-Wallet + Base Mainnet RPC

// ----- Configuration -----
const APP_NAME = "BASE-DOT-FUN";
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS"; // Replace with your deployed token contract
const BASE_RPC = "https://mainnet.base.org";
const CHAIN_ID = 8453;

let provider;
let signer;
let contract;

// ----- Connect Wallet Function -----
async function connectWallet() {
  try {
    if (window.ethereum) {
      // MetaMask / OKX injected wallet
      provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();

      if (network.chainId !== CHAIN_ID) {
        alert(Please switch your wallet to Base Mainnet (Chain ID ${CHAIN_ID}));
        return;
      }

      await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner();
      const address = await signer.getAddress();
      document.getElementById("walletAddress").innerText = ${APP_NAME} Wallet: ${address};

      // Load contract ABI
      const abi = await fetch('abi.json').then(res => res.json());
      contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      updateBalance();

    } else if (window.WalletConnectProvider) {
      // Fallback for WalletConnect (mobile / Farcaster)
      const wcProvider = new WalletConnectProvider.default({
        rpc: { [CHAIN_ID]: BASE_RPC },
        qrcode: true,
      });
      await wcProvider.enable();
      provider = new ethers.providers.Web3Provider(wcProvider);
      signer = provider.getSigner();
      const address = await signer.getAddress();
      document.getElementById("walletAddress").innerText = ${APP_NAME} Wallet: ${address};

      // Load contract ABI
      const abi = await fetch('abi.json').then(res => res.json());
      contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

      updateBalance();
    } else {
      alert("No compatible wallet found! Install MetaMask, OKX Wallet, or WalletConnect.");
    }
  } catch (err) {
    console.error(err);
    alert("Error connecting wallet: " + err.message);
  }
}

// ----- Update Token Balance -----
async function updateBalance() {
  try {
    const address = await signer.getAddress();
    const balance = await contract.balanceOf(address);
    document.getElementById("tokenBalance").innerText = ethers.utils.formatUnits(balance, 18);
  } catch (err) {
    console.error(err);
  }
}

// ----- Mint + Add Liquidity -----
async function mintAndAddLiquidity() {
  try {
    const tokenAmount = ethers.utils.parseUnits(document.getElementById("mintAmount").value, 18);
    const ethAmount = ethers.utils.parseEther(document.getElementById("ethAmount").value);
    document.getElementById("status").innerText = "Transaction pending...";
    
    const tx = await contract.mintAndAddLiquidity(tokenAmount, { value: ethAmount });
    await tx.wait();
    
    document.getElementById("status").innerText = "Mint + Liquidity Successful!";
    updateBalance();
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "Error: " + err.message;
  }
}

// ----- Swap Tokens (Placeholder) -----
async function swapTokens() {
  try {
    const from = document.getElementById("swapFrom").value;
    const to = document.getElementById("swapTo").value;
    const amount = ethers.utils.parseUnits(document.getElementById("swapAmount").value, 18);
    document.getElementById("status").innerText = "Swap pending...";

    // TODO: Integrate Base DEX Router for real swap
    alert("Swap function placeholder: integrate Base DEX Router here");
    document.getElementById("status").innerText = "Swap executed!";
  } catch (err) {
    console.error(err);
    document.getElementById("status").innerText = "Error: " + err.message;
  }
}

// ----- Event Listeners -----
document.getElementById("connectWallet").onclick = connectWallet;
document.getElementById("mintBtn").onclick = mintAndAddLiquidity;
document.getElementById("swapBtn").onclick = swapTokens;
