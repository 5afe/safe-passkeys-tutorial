'use client'

import { useState } from 'react'
import { Safe4337Pack } from '@safe-global/relay-kit'

import PasskeyList from '../components/PasskeyList'
import { executeUSDCTransfer } from '../lib/usdc'
import { getPasskeyFromRawId, type PasskeyArgType } from '../lib/passkeys'
import { BUNDLER_URL, RPC_URL } from '../lib/constants'
import { bufferToString } from '../lib/utils'

function Create4337SafeAccount () {
  const [selectedPasskey, setSelectedPasskey] = useState<PasskeyArgType>()
  const [safeAddress, setSafeAddress] = useState<string>()
  const [isSafeDeployed, setIsSafeDeployed] = useState<boolean>()

  const selectPasskeySigner = async (rawId: string) => {
    console.log('selected passkey signer: ', rawId)

    const passkey = await getPasskeyFromRawId(rawId)

    const safe4337Pack = await Safe4337Pack.init({
      provider: RPC_URL,
      rpcUrl: RPC_URL,
      signer: passkey,
      bundlerUrl: BUNDLER_URL,
      options: {
        owners: [],
        threshold: 1
      }
    })

    const safeAddress = await safe4337Pack.protocolKit.getAddress()
    const isSafeDeployed = await safe4337Pack.protocolKit.isSafeDeployed()

    setSelectedPasskey(passkey)
    setSafeAddress(safeAddress)
    setIsSafeDeployed(isSafeDeployed)
  }

  return (
    <>
      <h1>Passkeys tutorial</h1>

      <div>Create a new 4337 compatible Safe Account using passkeys</div>

      {selectedPasskey && (
        <>
          <h2>Passkey Selected</h2>

          <div style={{ maxWidth: '100%' }}>
            {bufferToString(selectedPasskey.rawId)}
          </div>
        </>
      )}

      {safeAddress && (
        <>
          <h2>Safe Account</h2>

          <div style={{ maxWidth: '100%' }}>Address: {safeAddress}</div>
          <div>Is deployed?: {isSafeDeployed ? 'Yes' : 'No'}</div>

          {selectedPasskey && (
            <button
              onClick={() =>
                executeUSDCTransfer({ signer: selectedPasskey, safeAddress })
              }
            >
              Sign transaction with passkey
            </button>
          )}
        </>
      )}

      <PasskeyList selectPasskeySigner={selectPasskeySigner} />
    </>
  )
}

export default Create4337SafeAccount
