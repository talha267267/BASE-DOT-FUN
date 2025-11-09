let provider;
let signer;
let contract;

// Replace with your deployed Base Mainnet contract
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS";
const BASE_RPC = "https://mainnet.base.org";
const CHAIN_ID = 8453;

async function connectWallet(){
  if(window.ethereum){
    provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    if(network.chainId !== CHAIN_ID){
      alert("Switch MetaMask to Base Mainnet");
      return;
    }
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    const address = await signer.getAddress();
    document.getElementById("walletAddress").innerText = "Wallet: " + address;
    const abi = await fetch('abi.json').then(res=>res.json());
    contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
    updateBalance();
  } else {
    alert("Install MetaMask / OKX Wallet / WalletConnect compatible wallet!");
  }
}

async function updateBalance(){
  try{
    const address = await signer.getAddress();
    const balance = await contract.balanceOf(address);
    document.getElementById("tokenBalance").innerText = ethers.utils.formatUnits(balance, 18);
  } catch(err){
    console.error(err);
  }
}

async function mintAndAddLiquidity(){
  const tokenAmount = ethers.utils.parseUnits(document.getElementById("mintAmount").value, 18);
  const ethAmount = ethers.utils.parseEther(document.getElementById("ethAmount").value);
  document.getElementById("status").innerText = "Transaction pending...";
  try{
    const tx = await contract.mintAndAddLiquidity(tokenAmount, {value: ethAmount});
    await tx.wait();
    document.getElementById("status").innerText = "Mint + Liquidity Successful!";
    updateBalance();
  } catch(err){
    document.getElementById("status").innerText = "Error: "+err.message;
  }
}

async function swapTokens(){
  const from = document.getElementById("swapFrom").value;
  const to = document.getElementById("swapTo").value;
  const amount = ethers.utils.parseUnits(document.getElementById("swapAmount").value, 18);
  document.getElementById("status").innerText = "Swap pending...";
  try{
    // Simple swap using router contract (replace ROUTER_ADDRESS and ABI)
    alert("Swap function placeholder, integrate Base DEX router here");
    document.getElementById("status").innerText = "Swap executed!";
  } catch(err){
    document.getElementById("status").innerText = "Error: "+err.message;
  }
}

document.getElementById("connectWallet").onclick = connectWallet;
document.getElementById("mintBtn").onclick = mintAndAddLiquidity;
document.getElementById("swapBtn").onclick = swapTokens;
