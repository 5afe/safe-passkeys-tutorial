import { useState } from "react";
import { PasskeyArgType } from "@safe-global/protocol-kit";
import { Button, Divider, Paper, Stack, Typography } from "@mui/material";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import { loadPasskeysFromLocalStorage } from "../lib/passkeys";

type props = {
  handleCreatePasskey: () => {};
  handleSelectPasskey: (passkey: PasskeyArgType) => {};
};

function LoginWithPasskey({ handleCreatePasskey, handleSelectPasskey }: props) {
  const [passkeys, setPasskeys] = useState<PasskeyArgType[]>([]);

  return (
    <Paper sx={{ margin: "32px auto 0" }}>
      <Stack padding={4}>
        <Typography textAlign={"center"} variant="h1" color={"primary"}>
          Use Safe Account via Passkeys
        </Typography>

        <Typography
          textAlign={"center"}
          marginBottom={8}
          marginTop={8}
          variant="h4"
        >
          Create a new Safe using Passkeys
        </Typography>

        <Button
          onClick={handleCreatePasskey}
          startIcon={<FingerprintIcon />}
          variant="outlined"
          sx={{ marginBottom: "24px" }}
        >
          Create a new Passkey
        </Button>

        <Divider sx={{ marginTop: "32px" }}>
          <Typography variant="caption" color="GrayText">
            OR
          </Typography>
        </Divider>

        <Typography
          textAlign={"center"}
          marginBottom={8}
          marginTop={8}
          variant="h4"
        >
          Connect existing Safe using an existing PassKey
        </Typography>

        <Button
          startIcon={<FingerprintIcon />}
          variant="contained"
          onClick={async () => {
            const passkeys = loadPasskeysFromLocalStorage();

            setPasskeys(passkeys);
            handleSelectPasskey(passkeys[0]);
          }}
        >
          Use an existing Passkey
        </Button>
      </Stack>
    </Paper>
  );
}

export default LoginWithPasskey;
