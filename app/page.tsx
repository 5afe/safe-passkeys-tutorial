'use client'

import { useState } from 'react'
import { Safe4337Pack } from '@safe-global/relay-kit'
import { PasskeyArgType } from '@safe-global/protocol-kit'

import PasskeyList from '../components/PasskeyList'
import { executeUSDCTransfer } from '../lib/usdc'
import { getPasskeyFromRawId } from '../lib/passkeys'
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
    <div>
      <h1>Safe Account 4337 compatible</h1>

      <p>Create a new Safe Account 4337 compatible using passkeys</p>

      {selectedPasskey && (
        <div>
          <h2>Passkey Selected</h2>

          <p>{bufferToString(selectedPasskey.rawId)}</p>
        </div>
      )}

      {safeAddress && (
        <div>
          <h2>Safe Account</h2>

          <p>Address: {safeAddress}</p>
          <p>Is deployed?: {isSafeDeployed ? 'Yes' : 'No'}</p>

          {selectedPasskey && (
            <button
              onClick={() =>
                executeUSDCTransfer({ signer: selectedPasskey, safeAddress })
              }
            >
              Execute USDC Transfers
            </button>
          )}
        </div>
      )}

      <PasskeyList selectPasskeySigner={selectPasskeySigner} />
    </div>
  )
}

export default Create4337SafeAccount
