import { useEffect, useState } from 'react'

import {
  createPasskey,
  loadPasskeys,
  storePasskey,
  type PasskeyItemType
} from '../lib/passkeys'

type Props = {
  selectPasskeySigner: (rawId: string) => void
}

function PasskeyList ({ selectPasskeySigner }: Props) {
  const [passkeyList, setPasskeyList] = useState<PasskeyItemType[]>()

  async function handleSubmit () {
    const passkey = await createPasskey()
    storePasskey(passkey)
    refreshPasskeyList()
  }

  function refreshPasskeyList () {
    const passkeys = loadPasskeys()
    setPasskeyList(passkeys)
  }

  useEffect(() => {
    refreshPasskeyList()
  }, [])

  return (
    <>
      <h3>Create new Passkey</h3>
      <button onClick={handleSubmit}>Add New Passkey</button>{' '}
      <h2>Passkey List</h2>
      {passkeyList?.map(passkey => (
        <div
          style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
          key={passkey.rawId}
        >
          Id: {passkey.rawId}{' '}
          <button onClick={() => selectPasskeySigner(passkey.rawId)}>
            Select
          </button>
        </div>
      ))}
    </>
  )
}

export default PasskeyList
