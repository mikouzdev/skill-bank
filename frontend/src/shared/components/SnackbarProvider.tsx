import { Alert, Snackbar, type AlertColor } from "@mui/material";
import { SnackbarContext } from "./SnackbarContext";
import { useState } from "react";

const DEFAULT_AUTO_HIDE = 5000;

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
    autoHideDuration: DEFAULT_AUTO_HIDE,
  });

  function show(
    message: string,
    severity: AlertColor = "success",
    opts?: { autoHideDuration?: number }
  ) {
    setSnackbar({
      open: true,
      message,
      severity,
      autoHideDuration: opts?.autoHideDuration ?? DEFAULT_AUTO_HIDE,
    });
  }

  function showSuccess(message: string, opts?: { autoHideDuration?: number }) {
    show(message, "success", opts);
  }

  function showError(message: string, opts?: { autoHideDuration?: number }) {
    show(message, "error", opts);
  }

  function handleClose() {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }

  return (
    <SnackbarContext.Provider value={{ show, showSuccess, showError }}>
      <Snackbar
        open={snackbar.open}
        onClose={handleClose}
        autoHideDuration={5000}
      >
        <Alert
          severity={snackbar.severity as AlertColor}
          onClose={handleClose}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      {children}
    </SnackbarContext.Provider>
  );
}
