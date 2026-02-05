import { ThemeProvider } from "@emotion/react";
import { CenterFloatingForm } from "../../../styles/formsTheme";
import { CustomerLoginPageForm } from "../components/CustomerLoginPageForm";
import { formsTheme } from "../../../styles/theme";

export default function CustomerLoginPage() {
  return (
    <ThemeProvider theme={formsTheme}>
      <CenterFloatingForm>
        <CustomerLoginPageForm />
      </CenterFloatingForm>
    </ThemeProvider>
  );
}
