import { useContext } from "react";
import { SnackbarContext, type SnackbarApi } from "./SnackbarContext";

export function useSnackbar(): SnackbarApi {
  try {
    const ctx = useContext(SnackbarContext);

    if (!ctx) {
      throw new Error("useSnackbar must be used inside <SnackbarProvider>");
    }

    return ctx;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
