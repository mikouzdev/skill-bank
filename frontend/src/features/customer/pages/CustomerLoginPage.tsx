import { ThemeProvider } from "@emotion/react";
import { CenterFloatingForm } from "../../../styles/formsTheme";
import { CustomerLoginPageForm } from "../components/CustomerLoginPageForm";
import { formsTheme } from "../../../styles/theme";
import { Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../app/hooks/useAuth";
import { useState } from "react";
import type { components } from "@api-types/openapi";
import CustomerSingleOffer from "./CustomerSingleOffer";

type OfferPage = components["schemas"]["OfferPage"];

export default function CustomerLoginPage() {
  const [offer, setOffer] = useState<OfferPage>();

  const { offerLogin } = useAuth();
  const { sID, oID } = useParams();
  const salesID = Number(sID) || undefined;
  const offerID = Number(oID) || undefined;

  async function handleCustomerLogin(password: string) {
    try {
      if (salesID === undefined || offerID === undefined) return;
      const response = await offerLogin(salesID, offerID, { password });
      console.log(response);
      setOffer(response);
    } catch (error) {
      console.log(error);
    }
  }

  if (offerID === undefined || salesID === undefined)
    return <Typography>Missing offer parameters in URL</Typography>;

  if (offer) return <CustomerSingleOffer offerData={offer} />;

  return (
    <ThemeProvider theme={formsTheme}>
      <CenterFloatingForm>
        <CustomerLoginPageForm onSubmit={handleCustomerLogin} />
      </CenterFloatingForm>
    </ThemeProvider>
  );
}
