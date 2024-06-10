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
    <div>
      <h2>Passkey List</h2>
      <ul>
        {passkeyList?.map(passkey => (
          <li
            key={passkey.rawId}
            style={{ textAlign: 'start', margin: '12px 0px' }}
          >
            Id: {passkey.rawId}{' '}
            <button onClick={() => selectPasskeySigner(passkey.rawId)}>
              select
            </button>
          </li>
        ))}
      </ul>
      <h3>Create new Passkey</h3>
      <button onClick={handleSubmit}>Add New Passkey</button>{' '}
    </div>
  )
}

export default PasskeyList
