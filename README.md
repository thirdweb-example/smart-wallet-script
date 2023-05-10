# Smart Wallet demo script

This simple node script demonstrates how to use thirdweb to deploy and use Smart Wallets - ERC4337 smart contracts - using the Wallet SDK.

The script will:

1. generate a personal wallet using LocalWallet
2. connect to the corresponding smart wallet
3. claim a ERC20 token using the thirdweb SDK

## Install dependencies

```bash
yarn install
```

## Configuration

The script requires a thirdweb API key.

paste your api key in your .env file:

```.env
THIRDWEB_API_KEY={{your_api_key}}
```

## Run the project:

```bash
yarn dev
```

## Documentation

Full documentation at: [https://portal.thirdweb.com/wallet/smart-wallet](https://portal.thirdweb.com/wallet/smart-wallet)
