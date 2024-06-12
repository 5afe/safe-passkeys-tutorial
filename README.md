# How to build an app with Safe and passkeys

This example app shows how to create a web app for using passkeys in your Safe. Please read [How to build an app with Safe and passkeys]() to see how this app was created.

## What you’ll need

**Prerequisite knowledge:** You will need some basic experience with [React](https://react.dev/learn), [Next.js](https://nextjs.org/docs), and [ERC-4337]().

Before progressing with the tutorial, please make sure you have:

- Downloaded and installed [Node.js](https://nodejs.org/en/download/package-manager) and [pnpm](https://pnpm.io/installation).
- Created an API key from [Pimlico](https://www.pimlico.io/).
- (Optional) [USDC](https://faucet.circle.com/) on Ethereum Sepolia.


## Getting Started

To install this example application, run the following commands:

```bash
git clone https://github.com/5afe/tutorial-passkeys.git
cd tutorial-passkeys
pnpm i
```

This will get a copy of the project installed locally. Now, create a file named `.env.local` at the root of your project, and add your Pimlico API key to it:

```bash
echo "NEXT_PUBLIC_PIMLICO_API_KEY='your_pimlico_api_key_goes_here'" > .env.local
```

Run the local development server with the following command:

```bash
pnpm dev
```

Go to `http://localhost:3000` in your browser to see the application.

## Help

Please post any questions on [Stack Exchange](https://ethereum.stackexchange.com/questions/tagged/safe-core) with the `safe-core` tag.

## License

MIT, see [LICENSE](LICENSE).
