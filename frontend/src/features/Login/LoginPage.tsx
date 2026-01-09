import { ThemeProvider } from "@emotion/react"
import { formsTheme } from "../../styles/formsTheme"
import { LoginPageForm } from "./Components/LoginPageForm"

import { CenterFloatingForm } from "../../styles/CenterFloatingForm"

export default function LoginPage() {

  return (
    <ThemeProvider theme={formsTheme}>
      <CenterFloatingForm>
        <LoginPageForm />
      </ CenterFloatingForm>
    </ThemeProvider>

  )

}