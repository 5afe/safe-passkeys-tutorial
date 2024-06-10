import { PasskeyArgType } from '@safe-global/protocol-kit'

import { STORAGE_PASSKEY_LIST_KEY } from './constants'
import { bufferToString, hexStringToUint8Array } from './utils'

export type PasskeyItemType = { rawId: string; publicKey: string }

export async function createPasskey (): Promise<PasskeyArgType> {
  const label = 'Safe Owner'
  // Generate a passkey credential using WebAuthn API
  const passkeyCredential = await navigator.credentials.create({
    publicKey: {
      pubKeyCredParams: [
        {
          // ECDSA w/ SHA-256: https://datatracker.ietf.org/doc/html/rfc8152#section-8.1
          alg: -7,
          type: 'public-key'
        }
      ],
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      rp: {
        name: 'Safe SmartAccount'
      },
      user: {
        displayName: label,
        id: crypto.getRandomValues(new Uint8Array(32)),
        name: label
      },
      timeout: 60_000,
      attestation: 'none'
    }
  })

  if (!passkeyCredential) {
    throw Error('Passkey creation failed: No credential was returned.')
  }

  console.log('passkeyCredential: ', passkeyCredential)

  const passkey = passkeyCredential as PublicKeyCredential
  const attestationResponse =
    passkey.response as AuthenticatorAttestationResponse

  const rawId = passkey.rawId
  const publicKey = attestationResponse.getPublicKey()

  if (!publicKey) {
    throw new Error('getPublicKey error')
  }

  return {
    rawId,
    publicKey
  }
}

export function storePasskey (passkey: PasskeyArgType) {
  const passkeys = loadPasskeys()

  const newPasskeyItem = {
    rawId: bufferToString(passkey.rawId),
    publicKey: bufferToString(passkey.publicKey)
  }

  passkeys.push(newPasskeyItem)

  localStorage.setItem(STORAGE_PASSKEY_LIST_KEY, JSON.stringify(passkeys))
}

export function loadPasskeys (): PasskeyItemType[] {
  const passkeysStored = localStorage.getItem(STORAGE_PASSKEY_LIST_KEY)

  const passkeyIds = passkeysStored ? JSON.parse(passkeysStored) : []

  return passkeyIds
}

function getPublicKeyFromLocalStorage (passkeyRawId: string): ArrayBuffer {
  const passkeys = loadPasskeys()

  const { publicKey } = passkeys.find(
    (passkey: PasskeyItemType) => passkey.rawId === passkeyRawId
  )!

  return hexStringToUint8Array(publicKey)
}

export async function getPasskeyFromRawId (
  passkeyRawId: string
): Promise<PasskeyArgType> {
  const passkeyCredentials = (await navigator.credentials.get({
    publicKey: {
      allowCredentials: [
        {
          id: hexStringToUint8Array(passkeyRawId),
          type: 'public-key'
        }
      ],
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      userVerification: 'required'
    }
  })) as PublicKeyCredential

  const publicKey = getPublicKeyFromLocalStorage(passkeyRawId)

  const passkey = {
    rawId: passkeyCredentials.rawId,
    publicKey
  }

  return passkey
}
