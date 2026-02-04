import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { useSnackbarState } from "./useSnackbarState";

export const ThrowErrorMessage = () => {
  const { state, showError, close } = useSnackbarState();

  return (
    <>
      <Button onClick={() => showError("Something broke!")}>
        Trigger error12
      </Button>

      <Snackbar
        open={state.open}
        autoHideDuration={6000}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={close} severity={state.severity} variant="filled">
          {state.message}
        </Alert>
      </Snackbar>
    </>
  );
};
