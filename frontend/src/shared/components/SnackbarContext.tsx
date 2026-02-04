import { type AlertColor } from "@mui/material";
import { createContext } from "react";

type ShowOptions = {
  autoHideDuration?: number;
};

export type SnackbarApi = {
  show: (message: string, severity?: AlertColor, opts?: ShowOptions) => void;
  showError: (message: string, opts?: ShowOptions) => void;
  showSuccess: (message: string, opts?: ShowOptions) => void;
};

export const SnackbarContext = createContext<SnackbarApi | null>(null);
