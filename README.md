# Smart Wallet demo script

This simple node script demonstrates how to use thirdweb to deploy and use Smart Wallets - ERC4337 smart contracts - using the Wallet SDK.

The script will:

1. generate a personal wallet using LocalWallet
2. connect to the corresponding smart wallet
3. claim a ERC20 token using the thirdweb SDK
4. create a scoped session key
5. claim a ERC20 using the session key
6. revoke the session key

## Install dependencies

```bash
yarn install
```

## Configuration

The script requires a thirdweb API key.

paste your thirdweb API secret key in your .env file:

```.env
THIRDWEB_SECRET_KEY={{your_secret_key}}
```

## Run the project:

```bash
yarn dev
```

## Documentation

Full documentation at: [https://portal.thirdweb.com/wallet/smart-wallet](https://portal.thirdweb.com/wallet/smart-wallet)
