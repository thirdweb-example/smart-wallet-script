import { config } from "dotenv";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Goerli } from "@thirdweb-dev/chains";
import { LocalWalletNode } from "@thirdweb-dev/wallets/evm/wallets/local-wallet-node";
import { SmartWallet, SmartWalletConfig } from "@thirdweb-dev/wallets";

config();

const chain = Goerli;
const factoryAddress = "0x5425683F8D635Ad0c80A4a166f8597C7DFA9b30F"; // AccountFactory
const tokenContract = "0xc54414e0E2DBE7E9565B75EFdC495c7eD12D3823"; // TokenDrop
const secretKey = process.env.THIRDWEB_SECRET_KEY as string;

const main = async () => {
  if (!secretKey) {
    throw new Error(
      "No API Key found, get one from https://thirdweb.com/dashboard"
    );
  }
  console.log("Running on", chain.slug, "with factory", factoryAddress);

  // ---- Connecting to a Smart Wallet ----

  // Load or create personal wallet
  // here we generate LocalWallet that will be stored in wallet.json
  const adminWallet = new LocalWalletNode();
  await adminWallet.loadOrCreate({
    strategy: "encryptedJson",
    password: "password",
  });
  const adminWalletAddress = await adminWallet.getAddress();
  console.log("Admin wallet address:", adminWalletAddress);

  // Configure the smart wallet
  const config: SmartWalletConfig = {
    chain,
    factoryAddress,
    secretKey,
    gasless: true,
  };

  // Connect the smart wallet
  const smartWallet = new SmartWallet(config);
  await smartWallet.connect({
    personalWallet: adminWallet,
  });

  // ---- Using the Smart Wallet ----

  // now use the SDK normally to perform transactions with the smart wallet
  let sdk = await ThirdwebSDK.fromWallet(smartWallet, chain, {
    secretKey: secretKey,
  });

  console.log("Smart Account address:", await sdk.wallet.getAddress());
  console.log("Balance:", (await sdk.wallet.balance()).displayValue);

  console.log("Claiming using Admin key");
  // Claim a ERC20 token
  await claimERC20Tokens(sdk);

  // ---- Creating Session Keys ----
  console.log("-------------------------");

  // generate a session key that will mint tokens on our behalf
  // this can be any wallet, including a backaend wallet
  const sessionWallet = new LocalWalletNode();
  sessionWallet.generate();
  const sessionKey = await sessionWallet.getAddress();

  console.log("Creating Session key:", sessionKey);

  await smartWallet.createSessionKey(sessionKey, {
    approvedCallTargets: [tokenContract], // approve the token contract
  });

  console.log("Session key added successfully!");

  // Fetch all signers on the smart wallet
  let signers = await smartWallet.getAllActiveSigners();
  console.log("Smart wallet now has", signers.length, "active signers");

  // Connect to the smart wallet using the session key
  const sessionSmartWallet = new SmartWallet(config);
  await sessionSmartWallet.connect({
    personalWallet: sessionWallet,
    accountAddress: await smartWallet.getAddress(),
  });

  // update the SDK to connect as the session smart wallet
  sdk = await ThirdwebSDK.fromWallet(sessionSmartWallet, chain, {
    secretKey: secretKey,
  });

  console.log("Claiming using session key");
  // claim tokens using the session key
  await claimERC20Tokens(sdk);

  // revoke session
  console.log("Revoking Session key:", sessionKey);
  await smartWallet.revokeSessionKey(sessionKey);

  console.log("Session key revoked successfully!");
  signers = await smartWallet.getAllActiveSigners();
  console.log("Smart wallet now has", signers.length, "active signer");
};

const claimERC20Tokens = async (sdk: ThirdwebSDK) => {
  const contract = await sdk.getContract(tokenContract);
  const tx = await contract.erc20.claim(1);
  console.log("Claimed 1 ERC20 token, tx hash:", tx.receipt.transactionHash);
  const tokenBalance = await contract.erc20.balance();
  console.log("ERC20 token balance:", tokenBalance.displayValue);
};

main();
