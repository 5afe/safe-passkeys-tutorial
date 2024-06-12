import { encodeFunctionData, parseAbi } from 'viem'
import { Safe4337Pack } from '@safe-global/relay-kit'

import { type PasskeyArgType } from './passkeys'
import {
  BUNDLER_URL,
  CHAIN_NAME,
  PAYMASTER_URL,
  RPC_URL,
  paymasterAddress,
  usdcTokenAddress
} from './constants'

const paymasterOptions = {
  isSponsored: true,
  paymasterAddress,
  paymasterUrl: PAYMASTER_URL
}

const generateTransferCallData = (to: string, value: bigint) => {
	const abi = parseAbi(["function transfer(address _to, number _value) returns (bool)"]) 
  return encodeFunctionData({
    abi,
    functionName: 'transfer',
    args: [to as `0x${string}`, value]
  })
}

export const executeUSDCTransfer = async ({
  signer,
  safeAddress
}: {
  signer: PasskeyArgType
  safeAddress: string
}) => {
  const safe4337Pack = await Safe4337Pack.init({
    provider: RPC_URL,
    rpcUrl: RPC_URL,
    signer,
    bundlerUrl: BUNDLER_URL,
    paymasterOptions,
    options: {
      owners: [
        /* Other owners... */
      ],
      threshold: 1
    }
  })

  const usdcAmount = 100_000n // 0.1 USDC

  const transferUSDC = {
    to: usdcTokenAddress,
    data: generateTransferCallData(safeAddress, usdcAmount),
    value: '0'
  }

  const safeOperation = await safe4337Pack.createTransaction({
    transactions: [transferUSDC]
  })

  const signedSafeOperation = await safe4337Pack.signSafeOperation(
    safeOperation
  )

  console.log('SafeOperation', signedSafeOperation)

  // 4) Execute SafeOperation
  const userOperationHash = await safe4337Pack.executeTransaction({
    executable: signedSafeOperation
  })

  console.log(
    `https://jiffyscan.xyz/userOpHash/${userOperationHash}?network=${CHAIN_NAME}`
  )
}
