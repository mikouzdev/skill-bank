import { type AlertColor } from "@mui/material";
import { useCallback, useState } from "react";

export type snackbarPlayload = {
  message: string;
  severity?: AlertColor;
  autoHideDuration?: number;
};

export type SnackbarState = {
  open: boolean;
  message: string;
  severity: AlertColor;
  autoHideDuration: number;
};

const DEFAULT_STATE: SnackbarState = {
  open: false,
  message: "",
  severity: "error",
  autoHideDuration: 6000,
};

export function useSnackbarState() {
  const [state, setState] = useState<SnackbarState>(DEFAULT_STATE);

  const show = useCallback((payload: snackbarPlayload) => {
    setState({
      open: true,
      message: payload.message,
      severity: payload.severity ?? "error",
      autoHideDuration:
        payload.autoHideDuration ?? DEFAULT_STATE.autoHideDuration,
    });
  }, []);

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const showError = useCallback(
    (message: string, opts?: Omit<snackbarPlayload, "message" | "severity">) =>
      show({ message, severity: "error", ...opts }),
    [show]
  );

  const showSuccess = useCallback(
    (message: string, opts?: Omit<snackbarPlayload, "message" | "severity">) =>
      show({ message, severity: "success", ...opts }),
    [show]
  );

  return {
    state,
    show,
    showError,
    showSuccess,
    close,
  };
}
